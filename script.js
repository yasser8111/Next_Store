// يخقي خلفيت الهيدر عندما يكون في اعلا الصفحه
const navbar = document.getElementById("navbar");

const handleScroll = () => {
  if (window.scrollY <= 1) {
    navbar.classList.add("top");
  } else {
    navbar.classList.remove("top");
  }
};

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);

// تمرير سلس للروابط الداخلية يجعل القسم ياتي في منتصف الشاشة
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').split('#')[1];
    const target = document.getElementById(id);
    if (!id || !target) return;

    e.preventDefault();

    const navH = document.querySelector('.navbar')?.offsetHeight || 0;
    const pos = target.getBoundingClientRect().top + scrollY;
    const offset = (innerHeight - target.offsetHeight) / 2;

    scrollTo({ top: pos - offset - navH / 2, behavior: 'smooth' });
  });
});


// اضهار و اخفاء قائمة الاختصرات في الشاشات الصغيرة
const navToggle = document.querySelector(".nav-toggle"),
      navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  navToggle.classList.toggle("active");
});

navMenu.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});
