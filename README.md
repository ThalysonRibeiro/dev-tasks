# Dev Tasks

Uma aplicação moderna de gerenciamento de tarefas para desenvolvedores, construída com Next.js 15 e as melhores práticas de desenvolvimento web.

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn](https://ui.shadcn.com/examples/dashboard)** - Compoents utilitário
- **[Geist Font](https://vercel.com/font)** - Fonte otimizada da Vercel

## 📋 Funcionalidades

- ✅ Interface moderna e responsiva
- 📱 Design mobile-first
- ⚡ Performance otimizada com Next.js
- 🎨 Estilização com Tailwind CSS
- 📝 Gerenciamento eficiente de tarefas
- 🔄 Hot reload durante desenvolvimento

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ThalysonRibeiro/dev-tasks.git
   cd dev-tasks
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   # ou
   bun install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```

4. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📁 Estrutura do Projeto

```
dev-tasks/
├── app/                    # App Router do Next.js 14
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── public/                # Arquivos estáticos
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── next.config.js         # Configuração do Next.js
├── tailwind.config.ts     # Configuração do Tailwind
├── tsconfig.json          # Configuração do TypeScript
└── package.json           # Dependências do projeto
```

## 🎯 Como usar

1. **Desenvolvimento**: Edite `app/page.tsx` para modificar a página principal
2. **Componentes**: Adicione novos componentes na pasta `components/`
3. **Estilos**: Utilize classes do Tailwind CSS para estilização
4. **Rotas**: Crie novas páginas na pasta `app/` seguindo a estrutura do App Router

## 📚 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria a build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Executa o linter
```

## 🚀 Deploy

### Vercel (Recomendado)

A maneira mais fácil de fazer deploy é usando a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push na branch main

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📖 Recursos Úteis

Para saber mais sobre Next.js, confira os recursos abaixo:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre as funcionalidades e API
- [Tutorial Interativo](https://nextjs.org/learn) - tutorial interativo do Next.js
- [Repositório do Next.js](https://github.com/vercel/next.js) - feedback e contribuições são bem-vindos!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thalyson Ribeiro**
- GitHub: [@ThalysonRibeiro](https://github.com/ThalysonRibeiro)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
