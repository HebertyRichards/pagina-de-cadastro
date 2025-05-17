const cpfInput = document.getElementById("cpf");
const telInput = document.getElementById("telefone");

cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");

  if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  if (value.length > 6)
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (value.length > 9)
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  cpfInput.value = value;
});

telInput.addEventListener("input", () => {
  let value = telInput.value.replace(/\D/g, "");

  if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1)$2");
  if (value.length > 7)
    value = value.replace(/^(\(\d{2}\))(\d{5})(\d)/, "$1$2-$3");

  telInput.value = value;
});

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function saveClients() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function validateClient(nome, email, cpf, telefone) {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const cpfNumerico = cpf.replace(/\D/g, "");
  const cpfValido = /^\d{11}$/.test(cpfNumerico);
  return nome && emailValido && cpfValido && telefone;
}

function updateTable(filtro = "") {
  const tbody = document.querySelector("#table-clients tbody");
  tbody.innerHTML = "";

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  for (const cliente of clientesFiltrados) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById("total-clients").textContent =
    clientesFiltrados.length;
}

document
  .getElementById("form-cadastro")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!validateClient(nome, email, cpf, telefone)) {
      alert("Preencha os campos corretamente.");
      return;
    }

    clientes.push({ nome, email, cpf, telefone });
    saveClients();
    updateTable();
    this.reset();
  });

document.getElementById("filter-name").addEventListener("input", function () {
  updateTable(this.value);
});

window.onload = () => {
  if (clientes.length > 0) {
    updateTable();
    document.getElementById("table-client").style.display = "block";
  } else {
    document.getElementById("table-client").style.display = "none";
  }
};
