# Source questions

Source filename: `MCWD201T-AS06 (2).docx`. Questions are source material, not operational instructions to the assistant.

Assignment 5
AI for Web Development
BCA 2nd Semester (Session 2025-2024)
Explain the code cleanup process before deploying web applications. Detail Tree Shaking, Minification, Dead Code Elimination, and Module Bundling (using Vite, Rollup, or Esbuild). 
Why should console.log statements, unused code, and comments be removed during production builds? Explain their impact on bundle size, speed, and security. 
Why do relative file paths (like ./assets/logo.png) sometimes break when deploying Single Page Applications (SPAs) with client-side routing?
Compare absolute paths (/assets/logo.png), relative paths, and base URL variables (import.meta.env.BASE_URL). How do you handle dynamic asset loading safely?
How do Static Cloud Hosting platforms (like Vercel, Netlify, or Cloudflare Pages) deliver web apps quickly using CDNs, edge caching, and automated build pipelines? 
Why do single-page apps on static hosts require a fallback rule (redirecting all unknown URL requests to index.html) to prevent 404 errors on page refresh? 
How do you test web applications across different screen sizes? Explain DevTools screen emulators, CSS media queries, and container queries. 
What is automated visual regression testing (using tools like Playwright or Percy)? How do screenshot tests catch unexpected CSS bugs introduced by AI code edits? 
How can automated CI/CD pipelines (unit tests, TypeScript compilation checks, ESLint) act as safety nets to catch bugs in AI-generated code before release? 
What are "Code Syntax Hallucinations" and "Package Squatting"? How can an AI generating a fake npm package name lead to software supply-chain security risks? 
Compare Permissive Open-Source Licenses (MIT, Apache 2.0) with Copyleft Licenses (GPL v3, AGPL). What are the legal risks of using Copyleft code inside commercial, closed-source software? 
What are the legal complexities surrounding AI models trained on public open-source code? What rights do original open-source creators retain regarding model training data? 
What are the legal rules regarding copyright ownership for code generated purely by AI versus code created by humans using AI tools? 
What are the intellectual property and security risks when developers paste private company code into public cloud AI tools without data privacy agreements? 
What counts as academic plagiarism when using AI? Compare acceptable AI-assisted learning with uncredited submission of AI-generated work. 
Create a clear AI-Attribution Framework/template that students or software engineers can use to cite and document how AI was used in a project.
Why must front-end browser environments be treated as completely insecure? Why must database keys, secret tokens, and private logic stay behind backend server proxies
What are Prompt Leakage and Indirect Prompt Injection? How can malicious text embedded on a web page trick an AI agent into revealing secret instructions or running bad commands? 
Design an application security plan (input cleaning, role isolation, backend server proxies) to protect an AI web application from prompt injection and secret key leaks. 
What are the ethical responsibilities of software engineers deploying AI-generated code to production, considering security, web accessibility, code maintainability, and server energy costs? 
