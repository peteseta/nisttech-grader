import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const rapidapiKey = process.env.RAPIDAPI_KEY;
const supabaseUrl = 'https://ekkdqhznzdyxjgablgfm.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const languages = {
    'python': 92, // Python 3.11.2
    'c': 75, // Clang 7.0.1
    'cpp': 76, // Clang 7.0.1
    'java': 91, // JDK 17.0.6
    'js': 93, // Node.js 18.15.0
}

/** @type {import('./$types').RequestHandler} */
export async function POST(request) {
    // console.log("returning preset results")
    // return json({
    //     "results": [{
    //         "testCaseId": 1,
    //         "status": "FAILED",
    //         "received": "8",
    //         "expected": "7",
    //         "memory": 13892,
    //         "time": "0.195",
    //         "error": null
    //     }, {
    //         "testCaseId": 2,
    //         "status": "FAILED",
    //         "received": "16",
    //         "expected": "15",
    //         "memory": 13668,
    //         "time": "0.185",
    //         "error": null
    //     }, {
    //         "testCaseId": 3,
    //         "status": "FAILED",
    //         "received": "38",
    //         "expected": "37",
    //         "memory": 13660,
    //         "time": "0.195",
    //         "error": null
    //     }]
    // });

    console.log("recieved: " + request.body)
    let { code, language, problemNumber } = request.body;
    console.log("REQUEST: " + code + "\nLANG: " + language + "\nPROBNO: " + problemNumber)

    // validate problem number
    if (typeof problemNumber !== 'number') {
        if (/^\d+$/.test(problemNumber)) {
            problemNumber = Number(problemNumber);
        } else {
            return { status: 400, body: { error: 'Invalid problem number'} };
        }
    }

    // get test cases from supabase
    const { data: testCases, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('problem_number', problemNumber);

    if (error) {
        return { status: 500, body: { error: 'Failed to fetch test cases: '+ error} };
    }

    console.log("TEST CASES: " + testCases);

    const results = [];

    const languageId = languages[language];
    if (!languageId) {
        return { status: 400, body: { error: 'Invalid language'} };
    }

    // test for each test case
    for (const testCase of testCases) {
        const input = testCase.input;
        const expectedOutput = testCase.output;

        console.log("checking " + input + "\n expecting " + expectedOutput);
        console.log("code: " + code);
        console.log("\n languageId: " + languageId);

        // submit to judge0
        let submissionToken;
        try {
            const createSubmissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*&wait=true', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': rapidapiKey,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                },
                body: JSON.stringify({
                    language_id: languageId,
                    // encode source code to base64
                    source_code: Buffer.from(code).toString('base64'),
                    // encode test input to base64
                    stdin: Buffer.from(input).toString('base64')    
                })
            });
            
            const submissionData = await createSubmissionResponse.json();
            console.log(submissionData);

            // decode submissionData.stdout from base64
            const decodedOutput = Buffer.from(submissionData.stdout, 'base64').toString();

            let status;
            if (decodedOutput.trim() === expectedOutput.trim()) {
                status = 'PASSED';
            } else {
                status = 'FAILED';
            }

            results.push({ testCaseId: testCase.id, status: status, received: decodedOutput.trim(), expected: expectedOutput.trim(), memory: submissionData.memory, time: submissionData.time, error: submissionData.stderr});

        } catch (error) {
            return { status: 500, body: { error: 'Failed to create submission to Judge0: ' + error } };
        }
    }

    return json({ results });
}