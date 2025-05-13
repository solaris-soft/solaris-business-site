export function initSmoothScroll() {
  document
    .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e: MouseEvent) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (!href) return;

        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Find the heading within the target section
          const heading = targetElement.querySelector("h2");
          if (heading instanceof HTMLElement) {
            // Remove animation classes
            heading.classList.remove("animate-heading");
            heading.classList.remove("animate-line");

            // Force reflow
            void heading.offsetHeight;

            // Add animation classes back
            heading.classList.add("animate-heading");
            heading.classList.add("animate-line");
          }

          // Scroll to the target
          targetElement.scrollIntoView({
            behavior: "smooth",
          });

          // Update URL without triggering native scroll
          history.pushState("", "", `#${targetId}`);
        }
      });
    });
}
