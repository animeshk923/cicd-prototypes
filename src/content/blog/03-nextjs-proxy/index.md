---
title: Proxy in Next.js
description: Utilising proxy configs to modify incoming client requests
date: 2026-01-19
tags:
  - nextjs
---
I'm building a product named CampusVault at the moment of writing this. While building this, I'm diving into a lot of concepts and rabbit-holes which I was not aware of earlier. Though I would like to spend time in those rabbit-holes to my heart's content, I'm focusing more towards building the product and getting it out in the world first.

While building it, I came across the concept of Proxy in Next.js. For a short answer, it's a middleware sitting between frontend and backend, running on the the edge network (can be vercel, cloudflare, etc.)

Let's understand this using a simple analogy first.

You're running a company and you're the CEO of it *(duh)*. There are different departments (web pages) in your company which handle different tasks. Let's say somebody (client/browser) comes in your company. Normally, you'd like to have a **receptionist** sat in front of your office, but for the time being let's assume you don't have one.

Now whoever comes in goes directly to you or any other department's person. The person which has come can be a potential client, or a suspicious one. You don't know. What happens now? 
You stop working, open the door, check the visitor's ID, and potentially kick them out if they aren't authorised. This wastes the your time and is a security risk because the intruder got all the way to the door. You will have to repeat this do it for every future person visiting your company. You wouldn't like that, would you?

Now this is where the role of your **receptionist (Proxy)** comes into play. Every single person *must* pass the receptionist before they can go further down. Your receptionist can take a few actions:

- **Redirect (Send Away)**: "You are looking for the old office. They moved to a new building. Go there." (Browser URL changes).
- **Rewrite (Stealth Routing):** "You want to see the 'Department of Fun'? Okay, go to Room 101." (The visitor thinks they are in 'Department of Fun', but they are actually in Room 101. The URL generally stays the same).
- **Modify Headers (The Visitor Badge):** "You are allowed in. Here is a 'Visitor' sticker for your shirt." (Adding data to the request so the destination room knows who you are).
- **Block (Response):** "You don't have an ID. You cannot enter." *(Returning a 403 Forbidden message)*.

This is how a Proxy works. Let's look this from the technical lens now.

In web architecture, a request usually flows directly from the Client (Browser) to the Server (Page logic). The **Proxy** is a piece of code that intercepts the HTTP request *before* it reaches your application logic (React components, Server Components, or API Routes). It sits at the "[network boundary](https://nextjs.org/learn/react-foundations/server-and-client-components#network-boundary)."

Traditionally, developers put logic like authentication checks inside every single page. This violates the DRY principle and creates maintenance nightmares. If you forgot to protect *one* page, your app was vulnerable. 
The Proxy centralises this logic. It executes lightweight code on the server *(generally fast due to edge network)* to decide what happens to the request.

An example:

If I want to show the dashboard of my app to logged-in user, my Proxy configurations would look something like below:
```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Check for a specific cookie (e.g., 'auth-token')
  const authToken = request.cookies.get("auth-token")?.value;

  // 2. Define protected paths
  // (Ideally, use the matcher config, but you can also check logic here)
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // 3. Logic: If trying to access dashboard without token, Redirect.
  if (isDashboard && !authToken) {
    // Create the new URL
    const loginUrl = new URL("/login", request.url);

    // Optional: Pass the original page as a query param to redirect back after login
    loginUrl.searchParams.set("from", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 4. Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Only run this logic on dashboard routes to save performance
  matcher: ["/dashboard/:path*"],
};

```
There are more ways you can utilise these options and make complex proxies according to your specific needs. Explore them and let me know what you find.

Happy tinkering!