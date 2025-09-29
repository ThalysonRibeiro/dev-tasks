import { CheckCircle, ListTodo, Settings } from "lucide-react";

export interface TestimonialsProps {
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: TestimonialsProps[] = [
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Maria Programadora",
    role: "Fullstack Developer",
    initials: "MP",
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "João Desenvolvedor",
    role: "Frontend Developer",
    initials: "JD",
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Ana Engenheira",
    role: "Software Engineer",
    initials: "AE",
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Carlos Programador",
    role: "Backend Developer",
    initials: "CP",
  },
  {
    quote:
      "Finalmente consegui organizar meus projetos de forma eficiente. As notificações me mantêm sempre no cronograma.",
    author: "Beatriz Silva",
    role: "Product Manager",
    initials: "BS",
  },
  {
    quote:
      "A interface intuitiva fez toda a diferença na minha produtividade diária. Recomendo para toda equipe de desenvolvimento.",
    author: "Pedro Santos",
    role: "Tech Lead",
    initials: "PS",
  },
  {
    quote:
      "Os relatórios detalhados me permitem apresentar dados concretos nas reuniões de sprint. É uma ferramenta essencial.",
    author: "Luana Costa",
    role: "Scrum Master",
    initials: "LC",
  },
  {
    quote:
      "A sincronização entre dispositivos é perfeita. Posso acompanhar meu trabalho tanto no escritório quanto em casa.",
    author: "Rafael Oliveira",
    role: "Mobile Developer",
    initials: "RO",
  },
  {
    quote:
      "As métricas de performance me ajudaram a identificar gargalos no meu workflow que eu nem sabia que existiam.",
    author: "Camila Torres",
    role: "DevOps Engineer",
    initials: "CT",
  },
  {
    quote:
      "Sistema robusto e confiável. Desde que comecei a usar, minha organização pessoal melhorou significativamente.",
    author: "Diego Ferreira",
    role: "Data Engineer",
    initials: "DF",
  },
  {
    quote:
      "A possibilidade de customizar dashboards tornou o acompanhamento do progresso muito mais visual e motivador.",
    author: "Fernanda Lima",
    role: "UX/UI Designer",
    initials: "FL",
  },
  {
    quote:
      "Integração perfeita com as ferramentas que já uso. Não precisei mudar meu fluxo de trabalho, apenas otimizei ele.",
    author: "Thiago Nascimento",
    role: "Solutions Architect",
    initials: "TN",
  },
];