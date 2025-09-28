---
title: Ollama Cloud Search API
url: blog/ollama-cloud-search-api
tags:
  - ollama
  - search-api
status: published
date: 2025-09-28T00:00:00.000Z
qblog_id: ea08012a-dec8-4a6e-932f-aa41973171c5
---

Ollama Cloud has now web search API which we can use to perform real time search. This is similar what Perplexity Search, Brave search, Exa.ai provides.

In their docs, they've claimed that they provide higher rate limit (but I'm not sure about the exact number though)

> Ollama provides a generous free tier of web searches for individuals to use, and higher rate limits are available via Ollama’s cloud.

Search API helps the LLM to get recent data which helps to generate more accurate response (and less hallucination)

## How to get started?
Create a Ollama [cloud account](https://ollama.com/cloud) and get [API](https://ollama.com/settings/keys) key from it.

![2025-09-28-at-13.43.072x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/urxbrojdrtlqnnd7ds24)

And then you can just use it by invoking this API endpoint like this

![2025-09-28-at-13.47.532x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/k7hy1lirjce7ifn9d6mc)

```shell
curl --location 'https://ollama.com/api/web_search' \
--header 'Authorization: Bearer $OLLAMA_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "query": "Ashik Nesin"
}'
```
<details>
<summary>Response</summary>
  
```json
  {
    "results": [
        {
            "title": "Ashik Nesin - Software Engineer & Maker",
            "url": "https://ashiknesin.com/",
            "content": "## Hi, I'm Ashik Nesin 👋\n\nI love helping business to **solve their day to day problems**. Over the last 9+ years, I have worked with various startups to developed a wide range of apps to launch/maintain business.\n\nCurrently, I'm working as a **Applied AI Engineer** with a SaaS company to make subscription management easier for everyone."
        },
        {
            "title": "Ashik N. - AI Engineer - LinkedIn",
            "url": "https://in.linkedin.com/in/ashiknesin",
            "content": "# Ashik N. [LinkedIn URL](https://in.linkedin.com/in/ashiknesin)\nAI Engineer\n### Principal Software Engineer at [Chargebee](https://www.linkedin.com/company/chargebee)\n### Chennai, Tamil Nadu, India [in]\n#### 870 followers 500 connections\n#### See your mutual connections\n## About me\nTLDR; *I build apps to solve business problems*Summary`````````````Building & maintaining custom SaaS apps is what I do every day.Over the last 6+ years, I have developed a wide range of web apps to launch/maintain small-business products.Current Tech Stack`````````````Frontend: HTML5, CSS, Javascript (Vanilla, React, Vue), TypeScript, WebpackBackend: Node.js (Express), Serverless stack (AWS Lambda, SQS), FirebaseMeta framework: Next.jsDB: MongoDB, DynamoDB, MySQLMobile: React NativeCross Platform: ElectronDevOps: Docker, AWS Stack, Travis, Circle CI, GitLab/Bitbucket PipelinesData Layer / API: GraphQL, Prisma.io, react-queryWeb Automation: Google Puppeteer\n## Work Experience\n- ### Principal Software Engineer at [Chargebee](https://www.linkedin.com/company/chargebee)\nI'm with the core engineering team, we develop new features for the subscription & invoices module and also improve the stability of the app :)\nMar 2019 - Present • 6 years 4 months\nChennai Area, India\n- ### Founder at [Nesin Technologies LLP](https://www.linkedin.com/company/nesin)\nIt's a tiny micro startup I'm building which focuses on helping small business owners automate their workflows\nJan 2019 - Present • 6 years 6 months\nChennai Area, India\n- ### Technical Writer at [AshikNesin.com]()\nI like to write whenever I find something useful and that has helped to solve issues for thousands of readers so far :)Apart from that I got to learn DevOps, SEO and lot of cool things over the years\nApr 2011 - Present • 14 years 3 months\n- ### Senior Frontend Engineer at [NFN Labs](https://www.linkedin.com/company/nfn-labs)\n- Frontend Team Lead- Built the entire browser extensions for Vookmark- Built the entire web frontend for Homescreen.me- Built the internal dashboard for SlashDr.com- Worked with an external remote team to build frontend for shift based work application- Worked as a external consultant for various clients like FundsIndia, OptaCredit, Huetrap, etc- Implemented CI/CD & also various automation process across the organisation\nAug 2015 - Dec 2018 • 3 years 5 months\nChennai Area, India\n- ### Web Development Intern at [NFN Labs](https://www.linkedin.com/company/nfn-labs)\nI've been playing around with web technologies from late 2000s but during this internship I started learning the foundations from scratch (well, the proper way of doing it. not copy-pasting from stackoverflow)And also worked on some static & WordPress websites\nJan 2015 - Jul 2015 • 7 months\nChennai Area, India\n- ### Web Development Intern at [ATOM Systems Private Limited](https://www.linkedin.com/company/atomgroups)\nHelped to build internal apps for the company\nAug 2014 - Dec 2014 • 5 months\nTrichy\n## Education\n- ### Bachelor of Engineering (B.E.) || Computer Science || Bachelor of Engineering (B.E.), Computer Science at [M.I.E.T. Engineering College](https://www.linkedin.com/school/m.i.e.t.-engineering-college/)\n2011 - 2015 •\n- ### Full Stack Web Development Certification || Computer Software Engineering at [Free Code Camp](https://www.linkedin.com/school/free-code-camp/)\n2016 - 2017 •\n- ### Higher Secondary Education || Computer Science at [Sri Sankara Matriculation Higher Secondary School]()\n2009 - 2011 •\n## Languages\n- ### English\nProfessional working proficiency\n- ### Tamil\nNative or bilingual proficiency\n## Certifications\n- ### Certified Payment-Card Industry Security Implementer - Developer at [SISA Information Security]()\nJul 2019\n- ### Bachelor of Engineering (CSE) at [Anna University]()\nApr 2015\n## Activity\n- ### Liked by Ashik N.\n[Userorbit is hiring a motivated…](https://www.linkedin.com/posts/userorbit_userorbit-is-hiring-a-motivated-product-minded-activity-7342120939930710016-0Huh)\n- ### Liked by Ashik N.\n[Your website is leaking…](https://www.linkedin.com/posts/rajeshpadman_your-website-is-leaking-leads-visitors-activity-7334105210455302144-jJbv)\n- ### Liked by Ashik N.\n[What started a year ago with a simple…](https://www.linkedin.com/posts/madhurink_gtm10-customersuccess-growth-activity-7331812494006460416-K7Pk)\n## Similar Profiles\n- [Kunal Yadav, Product Engineer at Intercom](https://www.linkedin.com/in/kunal-yadav)\n- [Sandeep Vattapparambil, ](https://www.linkedin.com/in/sandeep-vattapparambil-4129496b)\n- [Uddesh Jain, Senior Software Engineer at Almabase](https://www.linkedin.com/in/uddeshjain)\n- [Brijesh Agarwal, ](https://www.linkedin.com/in/agarwalbrijesh)\n- [Himanshu Tanwar, ](https://www.linkedin.com/in/coderavels)"
        },
        {
            "title": "Ashik Nesin AshikNesin - GitHub",
            "url": "https://github.com/ashiknesin",
            "content": "[Sign up](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E&source=header)"
        }
    ]
}
  ```
</details>

## References
- [Web search · Ollama Blog](https://ollama.com/blog/web-search)
- [Web Search API Docs](https://docs.ollama.com/web-search)

Happy performing search!