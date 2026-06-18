const FASTLY_SERVICE_ID = process.env.FASTLY_SERVICE_ID;
const FASTLY_API_TOKEN = process.env.FASTLY_API_TOKEN;
const DELETE_SNIPPETS = process.env.DELETE_SNIPPETS === "true";
const LOCK_AND_ACTIVATE_SERVICE = process.env.LOCK_AND_ACTIVATE_SERVICE === "true";

const snippets = [
  // redirects table
  {
    file: "./support-frontend/conf/fastly-snippets/redirects-table.vcl",
    name: "support-frontend - Redirects table",
    type: "init",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/redirects-table-recv.vcl",
    name: "support-frontend - Redirects table recv",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/redirects-table-error.vcl",
    name: "support-frontend - Redirects table error",
    type: "error",
  },
  // Compliance redirect
  {
    file: "./support-frontend/conf/fastly-snippets/compliance-redirect-recv.vcl",
    name: "support-frontend - Compliance redirect recv",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/compliance-redirect-error.vcl",
    name: "support-frontend - Compliance redirect error",
    type: "error",
  },
  // Frontline redirect
  {
    file: "./support-frontend/conf/fastly-snippets/frontline-redirect-recv.vcl",
    name: "support-frontend - Frontline redirect recv",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/frontline-redirect-deliver.vcl",
    name: "support-frontend - Frontline redirect deliver",
    type: "deliver",
  },
  // Observerarchive redirect
  {
    file: "./support-frontend/conf/fastly-snippets/observerarchive-redirect-recv.vcl",
    name: "support-frontend - Observer Archive redirect recv",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/observerarchive-redirect-error.vcl",
    name: "support-frontend - Observer Archive redirect error",
    type: "error",
  },
  // Live events redirect
  {
    file: "./support-frontend/conf/fastly-snippets/live-events-redirect-recv.vcl",
    name: "support-frontend - Live events redirect recv",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/live-events-redirect-error.vcl",
    name: "support-frontend - Live events redirect error",
    type: "error",
  },
  // Books redirect
  {
    file: "./support-frontend/conf/fastly-snippets/books-redirect-recv.vcl",
    name: "support-frontend - Books redirect recv",
    type: "recv",
  },
  // gu_geo_country-cookie
  {
    file: "./support-frontend/conf/fastly-snippets/gu_geo_country-cookie.vcl",
    name: "support-frontend - gu_geo_country cookie deliver",
    type: "deliver",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/vat-compliance-redirects-recv.vcl",
    name: "support-frontend - VAT compliance redirect",
    type: "recv",
  },
  {
    file: "./support-frontend/conf/fastly-snippets/vat-compliance-redirects-error.vcl",
    name: "support-frontend - VAT compliance redirect error",
    type: "error",
  },
];

/**
 * This method
 * - Finds the active version
 * - Clones the active version into the new version
 * - Deletes all the snippets (conditional)
 * - Creates | updates the snippets
 * - Activates the new version
 * - Locks the new version
 */
async function run() {
  // Find and clone the active version
  const activeVersionData = await fetch(
    `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version`,
    {
      method: "GET",
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

  // Delete all the snippets to ensure that what's in code is representative of what's
  // in Fastly.
  if (DELETE_SNIPPETS) {
    const snippetsData = await fetch(
      `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${activeVersion}/snippet`,
      {
        method: "GET",
        headers: {
          "Fastly-Key": FASTLY_API_TOKEN,
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());

    const deletedSnippetPromises = snippetsData.map(async ({ name }) => {
      const deleteSnippetData = await fetch(
        `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet/${encodeURIComponent(
          name
        )}`,
        {
          method: "DELETE",
          headers: {
            "Fastly-Key": FASTLY_API_TOKEN,
            Accept: "application/json",
          },
        }
      ).then((resp) => resp.json());

      console.info(`Deleted snippet ${name}`);
      return deleteSnippetData;
    });

    await Promise.all(deletedSnippetPromises);
    console.info(`Deleted all snippets`);
  }

  // Loop through the snippets
  for (const { file, name, type } of snippets) {
    // Check the snippet exists
    const snippetStatus = await fetch(
      `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet/${encodeURIComponent(
        name
      )}`,
      {
        method: "GET",
        headers: {
          "Fastly-Key": FASTLY_API_TOKEN,
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.status);
    const snippetExists = snippetStatus === 200;
    console.info(`Snippet exists: ${snippetExists} (${snippetStatus})`);

    const fs = require("fs");
    const snippetContent = fs.readFileSync(file, "utf-8");
    const formaData = new FormData();
    formaData.set("name", name);
    formaData.set("type", type);
    formaData.set("content", snippetContent);
    formaData.set("dynamic", 0);
    const body = new URLSearchParams(formaData).toString();

    if (snippetExists) {
      const updateData = await fetch(
        `https://api.fastly.com/service/${FASTLY_SERVICE_ID}/version/${clonedVersion}/snippet/${encodeURIComponent(
          name
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
  }

  if (LOCK_AND_ACTIVATE_SERVICE) {
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
  } else {
    console.info(`Version ${clonedVersion} created, but not activated and locked`);
  }
}

run();
