import "@logseq/libs";

import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { logseq as PL } from "../package.json";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);

const pluginId = PL.id;

function main() {
  console.info(`#${pluginId}: MAIN`);
  const root = ReactDOM.createRoot(document.getElementById("app")!);

  const schema:Array<SettingSchemaDesc> = [
    {
      key:"matedata_template",
      type:"string",
      inputAs:"textarea",
      default:`type:: $TYPE
cover:: $COVER
author:: $AUTHOR
actor:: $ACTOR
year:: $YEAR
tags:: 
`,
      title:"template",
      description:"insert template",
    },
  ];

  logseq.useSettingsSchema(schema)


  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  function createModel() {
    return {
      show() {
        logseq.showMainUI();
      },
    };
  }

  logseq.provideModel(createModel());
  logseq.setMainUIInlineStyle({
    zIndex: 11,
  });

  logseq.Editor.registerSlashCommand('metadata', async () => {
    logseq.showMainUI();
  })
}

logseq.ready(main).catch(console.error);
