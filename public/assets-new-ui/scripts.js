// ------------------------------------------------------------------------------------
// These are all the validation primitives we need in that page. Note that 
// 
// - they are completely separated from a particular rendering logic, as they 
//   should. As a result, they can be used in a vanilla JS or a framework-based 
//   JS code base with no change.
// - they use the native layer for rendering error messages.
// ------------------------------------------------------------------------------------

/**
 * Checks whether an input value respects the boundaries set on the input. if not,
 * we supply a custom error message.
 * Note: this is _already_ natively supported by the browser, except that the error
 * message does not specify whether the input overflows from above or below.
 */
const bounded = (msgBelow, msgAbove) => (e) => {
  if (e.valueAsNumber < parseInt(e.min)) {
    e.setCustomValidity(msgBelow);
  } else if (parseInt(e.max) < e.valueAsNumber) {
    e.setCustomValidity(msgAbove);
  } else {
    e.setCustomValidity('');
  }
}

const required = (msg) => (e) => {
  if (e.value.trim() === '') {
    e.setCustomValidity(msg);
  } else {
    e.setCustomValidity('');
  }
}

/**
 * Verifies if an element satisfies a set of rules.
 * ```
 *   Array<{ element: HTMLElement, predicates: Array<HTMLElement => void> }>
 * ```
 * @returns true if all the elements are valid
 */
const verify = (rules) => (element) => {
  rules.forEach(r => r(element));
  return element.checkValidity();
};

const verify1 = (rule) => (element) => verify([rule])(element);

// ------------------------------------------------------------------------------------
// Behaviour 

const toggleWith = (e1, e2, es) => {
  const check = () => {
    if (e2.checked) {
      show(e1);
      e1.focus();
      e1.required = true;
    } if (!e2.checked) {
      hide(e1);
      e1.value = e1.defaultValue;
      e1.required = false;
    }
  }

  e2.addEventListener('change', check);
  es.forEach(e => e.addEventListener('change', check));
  check();
}

const show = (e) => {
  e.parentElement.style.display = null;
}

const hide = (e) => {
  e.parentElement.style.display = 'none';
}

// ------------------------------------------------------------------------------------
// Wiring

const e1 = document.getElementById('contributionOther')
const e2 = document.getElementById('contributionAmount-other')
const es = Array.from(document.querySelectorAll('.form__radio-group--contribution-amount .form__radio-group__input'))
  .filter(e => e != e2);
toggleWith(e1, e2, es);

const reqam = verify([
  required('Please enter a numeric amount'),
  bounded('Please enter at least $1', '$2000 is the maximum we can accept')
])(e1);
const reqfn = verify1(required('Please enter your first name'));
const reqln = verify1(required('Please enter your last name'));
const reqem = verify1(required('Please enter your email'));
const reqst = verify1(required('Please select your state'));

e2.addEventListener('input', () => reqam(e2));

const fn = document.getElementById('contributionFirstName');
const ln = document.getElementById('contributionLastName')
const em = document.getElementById('contributionEmail')
const st = document.getElementById('contributionState')

reqfn(fn);
reqln(ln);
reqem(em);
reqst(st);

fn.addEventListener('input', () => reqfn(fn));
ln.addEventListener('input', () => reqln(ln));
em.addEventListener('input', () => reqem(em));
st.addEventListener('change', () => reqst(st));
