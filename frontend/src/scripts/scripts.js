
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function isAFunction(str) {
  return typeof str === "function";
}

export const useIntersectionObserver = (options) => {
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const { target, isIntersecting } = entry;

        if (isIntersecting) {
          target.classList.add("entryAnimation");

          if (!target.classList.contains("allowReobserver")) {
            observer.unobserve(target);
          }
        } else {
          if (target.classList.contains("allowReobserver")) {
            target.classList.remove("entryAnimation");
          }
        }
      });
    }, options);

    const timeout = setTimeout(() => {
      if (!isMounted) return;

      const elements = document.querySelectorAll(".useObserver");
      elements.forEach((el) => {
        observer.observe(el);
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [options, location.pathname]);
};

export function capFirstLetter(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function isValidInput(str){
  const rgx = /^[^\s].{2,}$/;

  return rgx.test(str)
}

export function isValidName(name){
  const rgx = /^[A-Za-zÀ-ÿ0-9]+(?: (da|de|do|dos|das) [A-Za-zÀ-ÿ0-9]+| [A-Za-zÀ-ÿ0-9]+)?$/;
  return isValidInput(name) && rgx.test(name);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isValidInput(email) && emailRegex.test(email);
}

export function isValidPw(pw){
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return isValidInput(pw) && pwRegex.test(pw);
}

