import { Article, Medication } from './types';

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'intro-hf',
    title: 'Understanding Your Diagnosis',
    category: 'Diagnosis',
    summary: 'An introduction to what heart failure is and how it affects your body.',
    points: ['Heart failure means the heart isn\'t pumping well.', 'It is not a stopped heart.', 'Managing it involves coordination with your care team.'],
    versionDate: '2024-05-20',
    content: `
# What is Heart Failure?

Heart failure doesn't mean your heart has stopped working. It means your heart isn't pumping blood as well as it should. Think of your heart like a pump in a house; if the pump gets weak or stiff, water (blood) starts to back up in the pipes.

## The Two Main Types
1. **Heart Failure with Reduced Ejection Fraction (HFrEF):** The heart muscle is weak and can't squeeze enough blood out.
2. **Heart Failure with Preserved Ejection Fraction (HFpEF):** The heart muscle is stiff and can't fill up with enough blood.

## Why Me?
Common causes include high blood pressure, past heart attacks, or diabetes. Your family doctor and cardiologist will work together to find the specific reason and the best treatment.
`
  },
  {
    id: 'facets-symptoms',
    title: 'Watching for Red Flags (FACETS)',
    category: 'Management',
    summary: 'Learn the FACETS acronym to identify symptoms early.',
    points: ['F is for Fatigue', 'E is for Edema', 'S is for Sudden weight gain'],
    versionDate: '2024-05-20',
    content: `
# When to Call the Doctor: FACETS

Use this acronym to remember common heart failure symptoms. If these are new or getting worse, call your clinic.

*   **F** - Fatigue (Feeling unusually tired)
*   **A** - Activity limitation (Can't do your usual walk or chores)
*   **C** - Chest congestion (Coughing or wheezing)
*   **E** - Edema (Swelling in legs, ankles, or belly)
*   **T** - Trouble breathing (Shortness of breath, especially when lying flat)
*   **S** - Sudden weight gain (3 lbs in a day or 5 lbs in a week)
`
  },
  {
    id: 'salt-fluid',
    title: 'Salt and Fluid Limits',
    category: 'Lifestyle',
    summary: 'Practical tips for managing your sodium and fluid intake.',
    points: ['Limit sodium to 2,000mg per day.', 'Limit fluid to 1.5-2 Liters.', 'Read labels carefully.'],
    versionDate: '2024-05-20',
    content: `
# Eating and Drinking for Your Heart

## The Salt (Sodium) Rule
Salt acts like a sponge, pulling fluid into your body. Aim for less than **2,000mg** of sodium per day. 
*   Avoid processed meats and canned soups.
*   Don't add salt at the table.
*   Use herbs and spices for flavor instead.

## The Fluid Limit
Your doctor might ask you to limit fluids to **1.5 to 2 Liters (6-8 cups)** total per day. This includes water, coffee, juice, and even soup or ice cream.
`
  },
  {
    id: 'palliative-care',
    title: 'Planning for the Future',
    category: 'Advanced Planning',
    summary: 'Information on palliative care and defining your goals of care.',
    points: ['Palliative care focuses on quality of life.', 'Discuss your goals early.', 'You can make changes at any time.'],
    versionDate: '2024-05-20',
    content: `
# Advanced Care and Quality of Life

Heart failure is a chronic journey. It's important to talk about what matters most to you.

## Palliative Care
This isn't just for the end of life. Palliative care helps manage symptoms and improve your quality of life at *any* stage of heart failure.

## Goals of Care
Think about your values:
*   What makes a "good day" for you?
*   What medical treatments are you willing (or unwilling) to undergo?
*   Who should make decisions for you if you cannot?
`
  }
];

export const COMMON_MEDS: any[] = []; // Deprecated in favor of medicationLibrary
