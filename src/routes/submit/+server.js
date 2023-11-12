import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { private_env } from "@sveltejs/kit/src/runtime/shared-server.js";

const rapidapiKey = process.env.RAPIDAPI_KEY;
const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const languages = {
  "python": 92, // Python 3.11.2
  "c": 75, // Clang 7.0.1
  "cpp": 76, // Clang 7.0.1
  "java": 91, // JDK 17.0.6
  "js": 93, // Node.js 18.15.0
};

/** @type {import('./$types.js').RequestHandler} */
export async function POST({ request }) {
  const { userId, code, language, problemNumber } = await request.json();

  // check if user id is valid
  if (!userId) {
    throw new Error(400, "Invalid user id");
  }

  // get problem data from supabase, check if problem number is valid
  let maxPoints;
  try {
    const result = await supabase
      .from("problems")
      .select("*")
      .eq("problem_no", problemNumber);
    maxPoints = result.data[0].points;
  } catch (error) {
    throw new Error(400, "Failed to fetch problem info: " + error);
  }

  // get test cases from supabase
  let testCases;
  try {
    const result = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_no", problemNumber);
    testCases = result.data;
  } catch (error) {
    throw error(500, "Failed to fetch test cases: " + error);
  }

  // get lagnuageId for Judge0 from dict
  const languageId = languages[language];
  if (!languageId) {
    throw error(400, "Invalid language");
  }

  const results = [];

  // test for each test case
  for (const testCase of testCases) {
    const input = testCase.input;
    const expectedOutput = testCase.output;

    // submit to judge0
    try {
      const createSubmissionResponse = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*&wait=true",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": rapidapiKey,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(input).toString("base64"),
            expected_output: Buffer.from(expectedOutput).toString("base64"),
          }),
        },
      );

      if (!createSubmissionResponse.ok) {
        // handle HTTP error responses here, this will catch 4xx and 5xx errors
        throw error(
          createSubmissionResponse.status,
          "Failed to create submission to Judge0: HTTP error.",
        );
      }

      const submissionData = await createSubmissionResponse.json();
      console.log("submissionData from judge0:");
      console.log(submissionData)

      // TODO: fix error handling - when something doesn't compile/syntax errors, it just returns 500.
      // we want to show these errors to the user.
      let status;
      if (submissionData.status.id === 3) {
        status = "Passed";
      } else if (submissionData.status.id === 4) {
        status = "Failed";
      } else if (submissionData.status.id === 5) {
        status = "Time limit exceeded";
      } else if (submissionData.status.id === 6) {
        status = "Compilation error";
      } else if (
        submissionData.status.id >= 7 && submissionData.status.id <= 12
      ) {
        status = "Runtime error";
      }

      // store test case results
      results.push({
        testCaseId: testCase.id,
        status: status,
        input: input,
        received: submissionData.stdout ? Buffer.from(submissionData.stdout, "base64").toString().trim() : null,
        expected: expectedOutput.trim(),
        memory: submissionData.memory,
        time: submissionData.time,
        error: submissionData.stderr ? Buffer.from(submissionData.stderr, "base64").toString().trim() : null,
      });

    } catch (err) {
      // Check if err.body and err.body.message exist and are strings
      if (err.body && typeof err.body.message === "string") {
        let decodedError = Buffer.from(err.body.message, "base64").toString();
        console.error(decodedError)
        throw new Error(
          500,
          "Failed to create submission to Judge0: " + decodedError,
        );
      } else {
        console.error(err);
        throw new Error(
          500,
          "Failed to create submission to Judge0: Unexpected error format.",
        );
      }
    }
  }

  // calculate score based on number of test cases passed
  const passedTests =
    results.filter((result) => result.status === "Passed").length;
  const totalTests = results.length;
  const points = parseFloat(
    ((passedTests / totalTests) * maxPoints).toFixed(1),
  );

  // calculate avg memory and runtime usage
  const avgMemory = parseFloat(
    (results.reduce((acc, result) => acc + result.memory, 0) / results.length)
      .toFixed(2),
  );
  const avgTime = parseFloat(
    (results.reduce((acc, result) => acc + parseFloat(result.time), 0) /
      results.length).toFixed(2),
  );

  console.log({
    user_id: userId,
    points: points,
    memory: avgMemory,
    runtime: avgTime,
    log: JSON.stringify(results),
    problem_no: problemNumber,
  });

  // store submission into supabase
  try {
    const { _response, error } = await supabase
      .from("submissions")
      .insert([
        {
          user_id: userId,
          points: points,
          memory: avgMemory,
          runtime: avgTime,
          log: JSON.stringify(results),
          problem_no: problemNumber,
        },
      ]);

    if (error) {
      console.log(error);
      throw new Error(500, "Failed to insert submission: " + error.message);
    }

    // return the individual test case results to client
    return json({ results, points, maxPoints });
  } catch (error) {
    console.log(error);
    throw new Error(500, "Failed to insert submission: " + error.message);
  }
}
