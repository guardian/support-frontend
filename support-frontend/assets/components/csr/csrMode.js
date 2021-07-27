export const listenForCsrDetails= (callback) =>
  window.addEventListener("message",
    (event) => {
      if (event.origin.startsWith("https://gnmtouchpoint")) {
        callback(event.data);
      }
    });
