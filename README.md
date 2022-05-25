# React demo of the LBDserver Client API
This is a demo project for using the LBDserver (NodeJS) client API (`npm i lbdserver-client-api`) in a ReactJS environment. 

## How to install
1. `git clone https://github.com/BVBISimonStef/lbdserver-plugin.git`
2. (node -v: 16 => tested with NodeJS 16)
3. `npm install`
4. `npm run start`

## Pages:
There are three pages: one for creating a project, a dashboard with all your current projects (if you are logged in with Solid) and a project page.

1. To create a project you have to fill in all parameters to make sure you're project data is complete.
2. On the dashboard you can see all you're projects. To make navigating more easy it has a search function and a sort function. Every project is displayed on a card with some basic info and a learn more button that is linked to the projectpage and a delete button.
3. The projectpage displays all the parameters and the datasets attached to the project. You can activate the datasets and when a fitting type is selected it can be viewed on one of the displays on the project page. You can also add datasets and delete datasets. They can be filtered on mediatype to quickly find all related datasets.
