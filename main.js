const contenedores = document.querySelectorAll(".contenedor");
const mostrar = document.getElementById("contenidoMostrado");

const contenidos = {
  1: `
    <ul class="list-unstyled lead fs-5 px-1 px-md-5 lh-1">
      <li>🔍 Descubre experiencias reales cerca de ti con recomendaciones auténticas.</li><br>
      <li>👤 Crea y personaliza tu perfil foodie para mostrar tus gustos.</li><br>
      <li>📤Comparte tus recomendaciones con amigos y la comunidad.</li><br>
      <li>⭐ Evalúa y comenta para ayudar a otros foodies a elegir bien.</li><br>
    </ul>
  `,
  2: `
    <ul class="list-unstyled lead px-1 px-md-5 lh-1">
      <li>🏪 Perfil dinámico que refleja automáticamente videos y menciones de usuarios.</li><br>
      <li>📝 Actualiza información clave como ubicación, horario y menú.</li><br>
      <li>📊 Panel de estadísticaspara ver vistas, guardados y menciones.</li><br>
      <li>🏷️ Etiquetas especiales para destacar características (Pet Friendly, Vegano, etc.).</li><br>
    </ul>
  `,
};

const emojisHTML = `
<div class="container py-4 ">
  <div class="row g-3 justify-content-center fs-1 ">
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
  <div class="row g-3 justify-content-center fs-1 ">
    <div class="col-auto emoji-efecto">🍇</div>
    <div class="col-auto emoji-efecto">🍫</div>
    <div class="col-auto emoji-efecto fs-3 ">SoyFoodie</div>
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

contenedores.forEach(function (contenedor) {
  contenedor.addEventListener("mouseenter", function () {
    var id = contenedor.getAttribute("data-id");
    if (contenidos[id]) {
      mostrar.innerHTML = contenidos[id];
    }
  });

  contenedor.addEventListener("mouseleave", function () {
    mostrar.innerHTML = emojisHTML;
  });
});
