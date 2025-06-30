---
title: Newsletter
date: 2024-12-25
description: 
tags: 
url: /newsletter
menu: main
---


<style>
  .newsletter-form {
    max-width: 400px;
    padding: 20px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    color: #ffffff;
  }
  
  .newsletter-form h2 {
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  
  .newsletter-form .icon {
    margin-right: 10px;
  }
  
  .newsletter-form p {
    margin: 0 0 20px;
    font-size: 14px;
    color: #aaaaaa;
  }
  
  .newsletter-form form {
    display: flex;
    gap: 10px;
  }
  
  .newsletter-form input[type="email"] {
    flex-grow: 1;
    padding: 10px 15px;
    background-color: #2a2a2a;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    color: #ffffff;
  }
  
  .newsletter-form input[type="email"]::placeholder {
    color: #777777;
  }
  
  .newsletter-form button {
    padding: 10px 20px;
    background-color: #2a2a2a;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .newsletter-form button:hover {
    background-color: #3a3a3a;
  }
</style>

<div class="newsletter-form">
  <h1><span class="icon">✉️</span> Stay up to date</h1>
  <p>Get notified when I publish something new, and unsubscribe at any time.</p>
  <form action="https://buttondown.com/api/emails/embed-subscribe/nesin-ai" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.com/nesin-ai', 'popupwindow')" class="embeddable-buttondown-form">
    <input type="email" name="email" id="bd-email" placeholder="Email address" required />
    <button type="submit">Join</button>
  </form>
</div>

