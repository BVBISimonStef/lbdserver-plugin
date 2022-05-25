# React demo of the LBDserver Client API
This is a demo project for using the LBDserver (NodeJS) client API (`npm i lbdserver-client-api`) in a ReactJS environment. 

## How to install
1. `git clone https://github.com/BVBISimonStef/lbdserver-plugin.git`
2. (node -v: 16 => tested with NodeJS 16)
3. `npm install`
4. `npm run start`

## Pages:
There are three pages: one for creating a project, a dashboard with all your current projects (if you are logged in with Solid) and a project page.

1. Now when you create a new project there are more project parameters to manage you're projects. All parameters have to be filled in to complete the creation of a project. The project will be stored on your personal Solid pod.
2. On the dashboard you can see all your projects. To make navigating more easy it has a search function and a sort function. Every project is displayed on a card with some basic info and a learn more button that is linked to the projectpage and a delete button. All projects are retrieved from the Solid pod. 
3. The projectpage displays all the parameters and the datasets attached to the project. The datasets are projectspecific and stored in in your Solid Database. You can activate the datasets and when a fitting type is selected it can be viewed on one of the displays on the project page. This leaves room for more plugins to be connected to the project page and add more functionality to the common data environment. You can also add datasets and delete datasets from your projectpage. The datasets can be filtered on mediatype to quickly find all related datasets.
