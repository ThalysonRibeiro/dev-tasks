"use client"
export function Header() {

  return (
    <header>
      <nav className="flex justify-between">
        <ul className="inline-flex gap-4">
          <li>Quadro principal</li>
          <li>Kanbam</li>
          <li>Calendário</li>
        </ul>
      </nav>
    </header>
  )
}