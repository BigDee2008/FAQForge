import OpenAI from "openai";
import type { FaqQuestion } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "placeholder-key"
});

export interface GenerateFaqParams {
  businessType: string;
  businessDescription: string;
  websiteUrl?: string;
  faqStyle: "accordion" | "simple";
}

export interface FaqGenerationResult {
  questions: FaqQuestion[];
  htmlCode: string;
  cssCode: string;
}

export async function generateFaqContent(params: GenerateFaqParams): Promise<FaqGenerationResult> {
  const { businessType, businessDescription, websiteUrl, faqStyle } = params;
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the environment variables.');
  }
  
  const systemPrompt = `You are an expert FAQ generator that creates comprehensive, relevant FAQ sections for businesses. 
  Generate 8-12 frequently asked questions with detailed, helpful answers based on the business information provided.
  
  Consider common customer concerns, service details, pricing, process, timeline, and support questions.
  Make answers professional, informative, and specific to the business type.
  
  Respond with JSON in this exact format:
  {
    "questions": [
      {
        "question": "Question text here",
        "answer": "Detailed answer here"
      }
    ]
  }`;

  const userPrompt = `Generate FAQs for this business:
  
  Business Type: ${businessType}
  Description: ${businessDescription}
  ${websiteUrl ? `Website: ${websiteUrl}` : ''}
  
  Create questions that potential customers would commonly ask about this business, including:
  - What services/products they offer
  - How their process works
  - Pricing and payment options
  - Timeline and expectations
  - What makes them different
  - Support and guarantees
  - Location/availability
  - Getting started process`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
    const questions: FaqQuestion[] = result.questions || [];

    // Generate HTML and CSS code
    const { htmlCode, cssCode } = generateFaqCode(questions, faqStyle);

    return {
      questions,
      htmlCode,
      cssCode
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate FAQ content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateFaqCode(questions: FaqQuestion[], style: "accordion" | "simple"): { htmlCode: string; cssCode: string } {
  if (style === "accordion") {
    return generateAccordionCode(questions);
  } else {
    return generateSimpleCode(questions);
  }
}

function generateAccordionCode(questions: FaqQuestion[]): { htmlCode: string; cssCode: string } {
  const htmlCode = `<div class="faq-section">
  <h2 class="faq-title">Frequently Asked Questions</h2>
  <div class="faq-container">
${questions.map((faq, index) => `    <div class="faq-item">
      <button class="faq-question" onclick="toggleFaq(${index})">
        <span>${faq.question}</span>
        <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div class="faq-answer" id="faq-${index}">
        <p>${faq.answer}</p>
      </div>
    </div>`).join('\n')}
  </div>
</div>

<script>
function toggleFaq(index) {
  const answer = document.getElementById('faq-' + index);
  const button = answer.previousElementSibling;
  const icon = button.querySelector('.faq-icon');
  
  if (answer.classList.contains('active')) {
    answer.classList.remove('active');
    icon.style.transform = 'rotate(0deg)';
  } else {
    // Close all other FAQs
    document.querySelectorAll('.faq-answer.active').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelectorAll('.faq-icon').forEach(icon => {
      icon.style.transform = 'rotate(0deg)';
    });
    
    // Open clicked FAQ
    answer.classList.add('active');
    icon.style.transform = 'rotate(180deg)';
  }
}
</script>`;

  const cssCode = `.faq-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.faq-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.faq-container {
  space-y: 1rem;
}

.faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.faq-question {
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background-color: #f9fafb;
}

.faq-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background-color: #f9fafb;
}

.faq-answer.active {
  max-height: 500px;
  padding: 1.25rem;
}

.faq-answer p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .faq-section {
    padding: 1rem;
  }
  
  .faq-title {
    font-size: 1.5rem;
  }
  
  .faq-question {
    padding: 1rem;
    font-size: 1rem;
  }
  
  .faq-answer.active {
    padding: 1rem;
  }
}`;

  return { htmlCode, cssCode };
}

function generateSimpleCode(questions: FaqQuestion[]): { htmlCode: string; cssCode: string } {
  const htmlCode = `<div class="faq-section">
  <h2 class="faq-title">Frequently Asked Questions</h2>
  <div class="faq-list">
${questions.map(faq => `    <div class="faq-item">
      <h3 class="faq-question">${faq.question}</h3>
      <p class="faq-answer">${faq.answer}</p>
    </div>`).join('\n')}
  </div>
</div>`;

  const cssCode = `.faq-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.faq-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.faq-list {
  space-y: 2rem;
}

.faq-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.faq-question {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.faq-answer {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .faq-section {
    padding: 1rem;
  }
  
  .faq-title {
    font-size: 1.5rem;
  }
  
  .faq-question {
    font-size: 1.1rem;
  }
}`;

  return { htmlCode, cssCode };
}
