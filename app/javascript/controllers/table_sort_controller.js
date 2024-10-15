import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["tableBody"];

  connect() {
    this.sortOrder = {};
  }

  sort(event) {
    const column = event.currentTarget.dataset.column;
    const rows = Array.from(this.tableBodyTarget.querySelectorAll("tr"));

    this.sortOrder[column] = this.sortOrder[column] === "asc" ? "desc" : "asc";

    const sortedRows = rows.sort((a, b) => {
      const aText = a.querySelector(`[data-column="${column}"]`)?.textContent.trim() || "";
      const bText = b.querySelector(`[data-column="${column}"]`)?.textContent.trim() || "";

      if (this.sortOrder[column] === "asc") {
        return aText.localeCompare(bText, undefined, { numeric: true });
      } else {
        return bText.localeCompare(aText, undefined, { numeric: true });
      }
    });

    this.tableBodyTarget.innerHTML = "";
    sortedRows.forEach(row => this.tableBodyTarget.appendChild(row));

    if (this.sortOrder[column] === "asc") {
      event.currentTarget.querySelector("span").innerHTML = "&#8595;";
    } else {
      event.currentTarget.querySelector("span").innerHTML = "&#8593;";
    }
  }

}
