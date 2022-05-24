import React from "react";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { getAuthentication } from "./components/login/functions";
import { useEffect, useState } from "react";
import { propagate, sessionTrigger as t } from "./atoms";
import conf from "./util/config";
import { useRecoilState, useRecoilValue } from "recoil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import { v4 } from "uuid";
import DemoPage from "./pages/DemoPage";
import DashboardPage from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import { project as p } from "./atoms";

import { Store } from "n3";

export const StoreContext = React.createContext(new Store());

function App() {
  const [trigger, setTrigger] = useRecoilState(t);
  const config = useRecoilValue(conf);
  const [update, setUpdate] = useRecoilState(propagate);
  const [project, setProject] = useRecoilState(p);
  let pages;

  if (project == null && getDefaultSession().info.isLoggedIn) {
    pages = [
      { label: "Dashboard", path: "/", component: DashboardPage, props: {} },
      {
        label: "Create Project",
        path: "/create",
        component: DemoPage,
        props: {},
      },
    ];
  } else if (project == null){
    pages = [
      { label: "Dashboard", path: "/", component: DashboardPage, props: {} }
    ];
  } else {
    pages = [
      { label: "Dashboard", path: "/", component: DashboardPage, props: {} },
      {
        label: "Projectpage",
        path: "/projectpage",
        component: ProjectPage,
        props: {},
      },
      {
        label: "Create Project",
        path: "/create",
        component: DemoPage,
        props: {},
      },
    ];
  }

  useEffect(() => {
    getAuthentication()
      .then(() => {
        setUpdate(v4());
      })
      .catch((error) => {
        console.log("error", error);
        // window.location = window.location.pathname
      });
  }, [trigger]);

  return (
    <div id={update}>
      <StoreContext.Provider value={new Store()}>
        <Header pages={pages} />
        <Routes>
          {pages.map((page) => {
            const Element = page.component;
            return (
              <Route
                key={page.label}
                exact
                path={page.path}
                element={<Element {...page.props} />}
              />
            );
          })}
        </Routes>
        {/* <AuthComponent/>
      <Child/> */}
      </StoreContext.Provider>
    </div>
  );
}

export default App;
