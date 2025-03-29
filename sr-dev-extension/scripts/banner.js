console.log("importing function");
const mappings = {
    'dev': {
        'textContent': 'You are in DEV',
        'border': 'orange'
    },
    'code': {
        'textContent': 'You are in CODE',
        'border': 'green'
    },
}
function addBanner(env) {
    const values = mappings[env]
    var headingText = document.createElement("span");
    headingText.style.fontSize = "40px";
    headingText.style.fontWeight = "bold";
    headingText.textContent = `****** ${values.textContent} ******`
    headingText.style.color = "red";
    headingText.style.background = values.border;
    var toolbarDiv = document.createElement('div');
    toolbarDiv.style.width = '100%';
    toolbarDiv.style.height = '50px';
    toolbarDiv.style.background = values.border;
    toolbarDiv.style.textAlign = 'center';
    toolbarDiv.style.verticalAlign = 'center';
    toolbarDiv.appendChild(headingText);

    const border = `10px solid ${values.border}`
    window.document.body.style.border = border;
    window.document.body.firstChild.border = border;
    toolbarDiv.border = border;

    window.document.body.insertBefore(toolbarDiv, window.document.body.firstChild);
}
