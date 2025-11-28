
import { GoogleGenAI } from "@google/genai";
import type { Student } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateReasonSuggestion = async (studentData: Partial<Student>): Promise<string> => {
  // SECURITY: Redacted PII (Name) to prevent data leakage to external AI service
  const prompt = `
    Based on the following student information, write a concise and professional 'reason to hold' entry for our records.
    The reason should be clear, objective, and actionable.

    Reason notes: ${studentData.reasonToHold || 'No initial notes provided.'}
    
    Generate a professional reason:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating reason suggestion:", error);
    return "Could not generate a suggestion at this time.";
  }
};

export const analyzeStudentData = async (student: Student): Promise<string> => {
    // SECURITY: Redacted PII (Name, Contact Info) to prevent data leakage to external AI service
    const prompt = `
    Analyze the situation for the following on-hold student and provide a brief summary and a suggested next action.
    Format the output as clean HTML with Tailwind CSS classes for styling. Use a heading for the summary and another for the suggested action.
    Use <p> tags for text and <strong> for emphasis. Use a div with class="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-sky-900/50 dark:border-sky-700" as the main container.

    Student Data:
    - Initiated Date: ${student.initiatedDate}
    - Reason to Hold: ${student.reasonToHold}
    - Follow Up Comments: ${student.followUpComments || 'N/A'}
    - Reminder Date: ${student.reminderDate}
    - Initiated By: ${student.initiatedBy} (Team: ${student.team || 'N/A'})
    - Status: ${student.status || 'N/A'}

    Generate the analysis:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing student data:", error);
        return "<p>Could not analyze student data at this time.</p>";
    }
};
