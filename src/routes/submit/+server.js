import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

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

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { userId, code, language, problemNumber } = await request.json();

  // validate problem number
  if (typeof problemNumber !== "number") {
    if (/^\d+$/.test(problemNumber)) {
      problemNumber = Number(problemNumber);
    } else {
      throw error(400, "Invalid problem number");
    }
  }

  // get test cases from supabase
  const { data: testCases, err } = await supabase
    .from("test_cases")
    .select("*")
    .eq("problem_number", problemNumber);

  if (testCases.length === 0) {
    throw error(400, "No test cases");
  }

  if (err) {
    throw error(500, "Failed to fetch test cases: " + err);
  }

  const results = [];

  const languageId = languages[language];
  if (!languageId) {
    throw error(400, "Invalid language");
  }

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
        throw error(createSubmissionResponse.status, "Failed to create submission to Judge0: HTTP error.");
      }

      const submissionData = await createSubmissionResponse.json();
      console.log(submissionData);

      let status;
      if (submissionData.status.id === 3) {
        status = "PASSED";
      } else if (submissionData.status.id === 4) {
        status = "FAILED";
      } else if (submissionData.status.id === 5) {
        throw error(408, "Time limit exceeded.");
      } else if (submissionData.status.id === 6) {
        throw error(422, "Compilation error.");
      } else if (
        submissionData.status.id >= 7 && submissionData.status.id <= 12
      ) {
        throw error(500, "Runtime Error: " + submissionData.stderr);
      }

      results.push({
        testCaseId: testCase.id,
        status: status,
        received: Buffer.from(submissionData.stdout, "base64").toString()
          .trim(),
        expected: expectedOutput.trim(),
        memory: submissionData.memory,
        time: submissionData.time,
        error: submissionData.stderr,
      });

    } catch (err) {
        // Check if err.body and err.body.message exist and are strings
        if (err.body && typeof err.body.message === 'string') {
            let decodedError = Buffer.from(err.body.message, 'base64').toString();
            throw error(500, "Failed to create submission to Judge0: " + decodedError);
        } else {
            console.error(err);
            throw error(500, "Failed to create submission to Judge0: Unexpected error format.");
        }
    }    
  }

  // unpack data and store to supabase database

  return json({ results });
}
