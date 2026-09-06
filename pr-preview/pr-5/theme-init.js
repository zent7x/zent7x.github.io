(function () {
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; } catch (e) {}
  }
  document.documentElement.classList.add("js");
  var dark = false;
  try {
    dark = localStorage.getItem("zentex-theme") === "dark";
  } catch (e) {}
  if (dark) document.documentElement.classList.add("dark");
})();
