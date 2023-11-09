const FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
const FASTLY_API_TOKEN = process.env.FASTLY_API_TOKEN;
const FASTLY_SERVICE_SNIPPET_FILE = process.env.FASTLY_SERVICE_SNIPPET_FILE;
const FASTLY_SERVICE_SNIPPET_NAME = process.env.FASTLY_SERVICE_SNIPPET_NAME;
const FASTLY_SERVICE_SNIPPET_TYPE = process.env.FASTLY_SERVICE_SNIPPET_TYPE;

async function run() {
  const activeVersionData = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version`,
    {
      headers: {
        "Fastly-Key": FASTLY_API_TOKEN,
        Accept: "application/json",
      },
    }
  ).then((resp) => resp.json());
  const activeVersion = activeVersionData.find(
    (version) => version.active === true
  ).number;
  console.info(`Active version: ${activeVersion}`);

  const clonedVersionData = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${activeVersion}/clone`,
    {
      method: "PUT",
      headers: {
        "Fastly-Key": FASTLY_API_TOKEN,
        Accept: "application/json",
      },
    }
  ).then((resp) => resp.json());
  const clonedVersion = clonedVersionData.number;
  console.info(`Cloned version ${activeVersion} => ${clonedVersion}`);

  // Check the snippet exists
  const snippetStatus = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet/${encodeURIComponent(
      FASTLY_SERVICE_SNIPPET_NAME
    )}`,
    {
      headers: {
        "Fastly-Key": FASTLY_API_TOKEN,
        Accept: "application/json",
      },
    }
  ).then((resp) => resp.status);
  const snippetExists = snippetStatus === 200;
  console.info(`Snippet exists: ${snippetExists} (${snippetStatus})`);

  const fs = require("fs");
  const snippetContent = fs.readFileSync(FASTLY_SERVICE_SNIPPET_FILE, "utf-8");
  const formaData = new FormData();
  formaData.set("name", FASTLY_SERVICE_SNIPPET_NAME);
  formaData.set("type", FASTLY_SERVICE_SNIPPET_TYPE);
  formaData.set("content", snippetContent);
  formaData.set("dynamic", 0);
  const body = new URLSearchParams(formaData).toString();

  if (snippetExists) {
    const updateData = await fetch(
      `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet/${encodeURIComponent(
        FASTLY_SERVICE_SNIPPET_NAME
      )}`,
      {
        method: "PUT",
        body,
        headers: {
          "Fastly-Key": FASTLY_API_TOKEN,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());
    console.info("Updated", updateData.updated_at);
  } else {
    // Create the snippet
    const createData = await fetch(
      `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet`,
      {
        method: "POST",
        body,
        headers: {
          "Fastly-Key": FASTLY_API_TOKEN,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());
    console.info("Created", createData.updated_at);
  }

  const activatedVersionData = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/activate`,
    {
      method: "PUT",
      headers: {
        "Fastly-Key": FASTLY_API_TOKEN,
        Accept: "application/json",
      },
    }
  ).then((resp) => resp.json());
  const activatedVersion = activatedVersionData.number;
  console.info(`Activated version ${activatedVersion}`);

  const lockedVersionData = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/lock`,
    {
      method: "PUT",
      headers: {
        "Fastly-Key": FASTLY_API_TOKEN,
        Accept: "application/json",
      },
    }
  ).then((resp) => resp.json());
  const lockedVersion = lockedVersionData.number;
  console.info(`Locked version ${lockedVersion}`);
}

run();
