# Visualizador de Cores de Pele - React

Uma aplicação React para visualizar e analisar tons de pele de imagens, convertida do HTML/JavaScript original para React com TypeScript.

## Funcionalidades

- **Visualização Interativa**: Exibe imagens com seus respectivos tons de pele
- **Gráficos Interativos**: Histogramas de distribuição de tons em HSL e LCH
- **Filtragem por Cliques**: Clique nas barras dos gráficos para filtrar imagens por tom específico
- **Múltiplos Espaços de Cor**: Suporte para HSL e LCH
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para desenvolvimento rápido
- **Chart.js** e **react-chartjs-2** para gráficos interativos
- **CSS Modules** para estilização

## Estrutura do Projeto

```
react-app/
├── public/
│   ├── processed.json    # Dados processados das imagens
│   └── files/           # Pasta com as imagens
├── src/
│   ├── App.tsx          # Componente principal
│   ├── App.css          # Estilos da aplicação
│   └── main.tsx         # Ponto de entrada
└── package.json
```

## Como Usar

1. **Instalação das Dependências**:
   ```bash
   npm install
   ```

2. **Executar em Desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5174`

3. **Build para Produção**:
   ```bash
   npm run build
   ```

## Funcionalidades Interativas

### Gráficos
- **Clique nas Barras**: Filtra as imagens para mostrar apenas aquelas com tons de pele na faixa clicada
- **Distribuição HSL**: Mostra a distribuição dos tons no espaço HSL
- **Distribuição LCH**: Mostra a distribuição dos tons no espaço LCH

### Filtragem
- **Botão Reset**: Aparece quando há um filtro ativo, permite voltar à visualização completa
- **Título Dinâmico**: Indica o filtro atual aplicado

## Dados

A aplicação utiliza dados processados do arquivo `processed.json` que contém:
- Nomes dos arquivos de imagem
- Cores de pele em formato hexadecimal
- Valores HSL normalizados
- Valores LCH

## Desenvolvimento

Para modificar ou estender a aplicação:

1. **Adicionar Novos Componentes**: Crie componentes em `src/components/`
2. **Modificar Gráficos**: Ajuste as opções do Chart.js no componente `Chart`
3. **Estilização**: Modifique `App.css` ou adicione CSS Modules
4. **Novos Espaços de Cor**: Estenda a interface `SkinToneData` e lógica de filtragem

## Comparação com Versão Anterior

- **HTML/JS → React**: Melhor organização de código e reusabilidade
- **TypeScript**: Type safety e melhor experiência de desenvolvimento
- **Componentes Reutilizáveis**: Fácil extensão e manutenção
- **React Libraries**: Acesso a ecossistema rico de bibliotecas React
- **Hot Reload**: Desenvolvimento mais rápido com Vite
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
