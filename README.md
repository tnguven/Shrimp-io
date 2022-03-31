Write a simple full-stack application that provides URL shortening functionality. The application
needs to use either vue.js, React or Angular on the frontend (SPA) and have an express driven API on
the backend. All the code should be written in Typescript. Styling of the frontend app should be
done using vanilla CSS. The specs for the application are:

- A user needs to be able to enter a URL and they will get an 8 character (lowercase-alphanumeric)
  shortened version of the URL.
- URLs are shortened and persisted into MongoDB via a REST or GraphQL API.
- The frontend app will display a list of previously shortened URLs. New URLs will be generated and
  added to the frontend list.
- The same 8-characters cannot be used twice i.e. each shortened URL needs to be unique.
- The URLs need to be shortened with the following domain 'pbid.io' e.g. https://pbid.io/f3x2ab1c
- The shortened URL do not need to actually redirect/work as the domain doesn’t exist.
- The entire system needs to be runnable using Docker, a simple compose file will do.
- Appropriate tests should be added to the code, using the jest framework.
- The app layout should be responsive.
- Add a root README.md describing what the application is, and how to run it.

It’s up to you how to layout and style the frontend, it doesn’t need to win any design awards , just
make it functional and easy to use. Add any extra tweaks to increase usability. Get the task done as
soon as you can, and upload the code onto a public git repo somewhere.
