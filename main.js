const contenedores = document.querySelectorAll(".contenedor");
const mostrar = document.getElementById("contenidoMostrado");

const contenidos = {
  1: `
    <ul class="list-unstyled lead fs-5">
      <li>🔍 Descubre experiencias reales cerca de ti con recomendaciones auténticas.</li>
      <li>👤 Crea y personaliza tu perfil foodie para mostrar tus gustos.</li>
      <li>📤Comparte tus recomendaciones con amigos y la comunidad.</li>
      <li>⭐ Evalúa y comenta para ayudar a otros foodies a elegir bien.</li>
    </ul>
  `,
  2: `
    <ul class="list-unstyled lead">
      <li>🏪 Perfil dinámico que refleja automáticamente videos y menciones de usuarios.</li>
      <li>📝 Actualiza información clave como ubicación, horario y menú.</li>
      <li>📊 Panel de estadísticaspara ver vistas, guardados y menciones.</li>
      <li>🏷️ Etiquetas especiales para destacar características (Pet Friendly, Vegano, etc.).</li>
      <li>❌ Sin integración con Uber Eats para enfocarse en la experiencia local directa.</li>
    </ul>
  `,
};

const emojisHTML = `
<div class="container py-4">
  <div class="row g-3 justify-content-center fs-1">
    <div class="col-auto emoji-efecto">🍔</div>
    <div class="col-auto emoji-efecto">🍕</div>
    <div class="col-auto emoji-efecto">🍣</div>
    <div class="col-auto emoji-efecto">🍦</div>
    <div class="col-auto emoji-efecto">🍩</div>
  </div>
  <div class="row g-3 justify-content-center fs-1">
    <div class="col-auto emoji-efecto">🥗</div>
    <div class="col-auto emoji-efecto">🥩</div>
    <div class="col-auto emoji-efecto">🌮</div>
    <div class="col-auto emoji-efecto">🍜</div>
  </div>
  <div class="row g-3 justify-content-center fs-1">
    <div class="col-auto emoji-efecto">🍇</div>
    <div class="col-auto emoji-efecto">🍫</div>
    <div class="col-auto emoji-efecto fs-3">SoyFoodie</div>
    <div class="col-auto emoji-efecto">🍤</div>
    <div class="col-auto emoji-efecto">🥖</div>
  </div>
  <div class="row g-3 justify-content-center fs-1">
    <div class="col-auto emoji-efecto">🥞</div>
    <div class="col-auto emoji-efecto">🧀</div>
    <div class="col-auto emoji-efecto">🥙</div>
    <div class="col-auto emoji-efecto">🍪</div>
  </div>
  <div class="row g-3 justify-content-center fs-1">
    <div class="col-auto emoji-efecto">🍉</div>
    <div class="col-auto emoji-efecto">🍋</div>
    <div class="col-auto emoji-efecto">🥬</div>
    <div class="col-auto emoji-efecto">🥔</div>
    <div class="col-auto emoji-efecto">🥕</div>
  </div>
</div>
`;

contenedores.forEach((contenedor) => {
  contenedor.addEventListener("mouseenter", () => {
    const id = contenedor.getAttribute("data-id");
    if (contenidos[id]) {
      mostrar.innerHTML = contenidos[id];
    }
  });

  contenedor.addEventListener("mouseleave", () => {
    mostrar.innerHTML = emojisHTML;
  });
});
