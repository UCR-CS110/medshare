# MedShare
A website to share medical equipment for patients and institutions.

## Description
Patients who require medical equipment often have a hard time getting their hands on it due to pricing and scarcity. MedShare is a medical equipment sharing website that makes it easy for patients to find the medical equipment that they need, and for providers to find patients who are in need of that medical equipment. Much like Airbnb, both the provider and patients/caregivers can leave ratings and reviews for the other after the service is complete. Over time, providers can build strong reputations, allowing patients to get access to reliable equipment from trustworthy sources.

## Team Contributions
### Gavin
- Authentication pages + backend
- Profiles implementation
- API routes for bookings, users, and admin
- Admin panel UI
- Search Page UI

### Keanu
- Created the Homepage UI
- Wrote the About page
- Organized some of the UI
- Title implementation

### Ben
- Made the Review Form UI
- Made Review API Endpoints
- Made Search API Endpoints
- Created the Listing Page UI
- Created Listing API Endpoints
- Helped Create Post Booking

## Features:
* Create and manage listings for medical equipment
* Book equipment from providers with an easy-to-use interface
* Leave reviews for specific listings
* Admin panel to manage users, listings, bookings, and reviews
* Search functionality to find listings based on keywords and filters
* User profiles with bios, provider types, and average ratings 


## Tools Used
- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Next.js API routes
- **Database**: MongoDB Atlas, Mongoose

## How to Run
1. Clone the repository
2. cd into the project directory:
```bash
`cd final-project-medshare`
```
2. Install dependencies:
```bash
`npm install`
```
3. Start the development server:
```bash
`npm run dev`
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Note: You will need to set up a `.env` file with the necessary environment variables for MongoDB connection and any other secrets. An example `.env.example` file is included in the repository.

Additionally, you must insert an admin user directly into the MongoDB database to access the admin panel. The easiest way to do this is to change the `role` field of an existing user document to `admin`.


## Generative AI Disclosure
Part of this code was created with the assistance of AI tools, specifically the tailwind styling and functions on the admin page, as well as the tailwind styling on the profile page. Additionally, all the team members have the in-editor autocomplete feature enabled, which also uses AI for code suggestions and completions. All auto-complete suggestions and pages created with the help of AI were reviewed by the team members.

<hr>

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c4wSHrp5)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23971265&assignment_repo_type=AssignmentRepo)