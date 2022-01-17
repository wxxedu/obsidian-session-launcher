import { App, Editor, FileManager, MarkdownEditView, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";
import { Session } from "apple-session-launcher";
import * as path from "path";

export default class MyPlugin extends Plugin {
  // This field stores your plugin settings.

  onInit() {}

  async onload() {
    console.log("Plugin is Loading...");

    this.addCommand({
      id: "apple-session-launcher-insert-snippet",
      name: "Insert Session Code",
      hotkeys: [{modifiers: ["Mod", "Shift"], key: "S"}],
      editorCallback: (editor: Editor, view: MarkdownView) => {
        editor.replaceSelection(`
        \`\`\`session
        Intent: 
        CategoryName:
        Duration: 25
        Count: 0
        Summary: 
        \`\`\`
        `);
      }
    })

    this.registerMarkdownCodeBlockProcessor("session", (source, el, ctx) => {
      
      let intent = source.split("Intent:")[1];
      // if intent exists
      if (intent) {
        intent = intent.split("\n")[0];
      }
      let duration = source.split("Duration:")[1];
      // if duration exists
      if (duration) {
        duration = duration.split("\n")[0];
      } 
      let categoryId = source.split("CategoryId:")[1];
      // if categoryId exists
      if (categoryId) {
        categoryId = categoryId.split("\n")[0];
      } 
      let categoryName = source.split("CategoryName:")[1];
      // if categoryName exists
      if (categoryName) {
        categoryName = categoryName.split("\n")[0];
        if (categoryName) {
          categoryName = categoryName.trim();
          console.log(categoryName);
          // if categoryName starts with a #
          if (categoryName.startsWith("#")) {
            categoryName = categoryName.substring(1);
            console.log(categoryName);
          }
        }
      } 
      console.log(intent, duration, categoryId, categoryName);

      // find out the content after "Summary:" to the end of the file
      let summary = source.split("Summary:")[1];
      if (summary) {
        summary = summary.split("\n")[0];
      } 

      let sessionCount = source.split("Count:")[1];
      if (sessionCount) {
        sessionCount = sessionCount.split("\n")[0];
      } else {
        // write "Count: " to the source
        // source = source + "Count: 0\n";
        sessionCount = "0";
      }
      // create a button to start the session
      const button = document.createElement("button");
      button.innerText = `${(Number(duration) > 0 ? duration : 25)} Min.`;
      button.addEventListener("click", () => {
        const session = new Session();
        if (intent) {
          session.setIntent(intent);
        }
        if (duration) {
          session.setDuration(Number(duration));
        }
        if (categoryId) {
          session.setCategoryId(categoryId);
        }
        if (categoryName) {
          session.setCategoryName(categoryName);
        }
      });
      button.className = "session-button";
      
      // create a span for the intent
      const intentSpan = document.createElement("span");
      intentSpan.innerText = intent;
      intentSpan.className = "session-intent";

      // create a span for the count
      const countSpan = document.createElement("span");
      countSpan.innerText = sessionCount.trim();
      countSpan.className = "session-count";

      // create a link for the category
      const categoryLink = document.createElement("a");
      categoryLink.innerText = categoryName;
      categoryLink.href = `obsidian://search?query=${encodeURIComponent(`#${categoryName}`)}`;
      categoryLink.className = "session-category";

      // create a div for the summary
      const summaryDiv = document.createElement("div");
      summaryDiv.innerText = summary;
      summaryDiv.className = "session-summary";

      const div = document.createElement("div");
      div.className = "session-div";

      // make button align to the right
      button.style.float = "right";
      // add category to the div if category exists
      if (categoryName) {
        div.appendChild(categoryLink);
      }

      // add intent to the div if intent exists
      if (intent) {
        div.appendChild(intentSpan);
      }
      
      // add count to the div
      div.appendChild(countSpan);
      // add button to the div
      div.appendChild(button);
      // add summary to the div if summary exists
      if (summary) {
        div.appendChild(summaryDiv);
      }
      // add div to the element
      el.appendChild(div);
    });
  }

  onunload() {
    console.log("Plugin is Unloading...");
  }
}