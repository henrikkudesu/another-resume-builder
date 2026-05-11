export const UI_TEXT = {
    hero: {
        title: "Apenas mais um gerador de curriculo",
        subtitle: "Escreva uma vez, refine com IA quando quiser e exporte em PDF ou Markdown com estrutura limpa para recrutadores e sistemas de triagem.",
        tutorialLink: "Ver tutorial rapido",
        chips: ["PDF", "Markdown", "IA assistida"],
    },
    tutorial: {
        eyebrow: "Guia rapido",
        title: "Seu curriculo pronto em poucos passos",
        lead: "Comece importando um PDF pronto ou preencha do zero. Em seguida, revise, ajuste os campos e exporte para enviar com seguranca.",
        actions: {
            importPdf: "Importar PDF",
            startBlank: "Comecar do zero",
            useExample: "Ver exemplo",
            backToResume: "Voltar ao curriculo",
        },
        steps: [
            {
                title: "Importe ou escreva",
                description: "Traga seu PDF pronto ou preencha os campos manualmente.",
            },
            {
                title: "Revise e ajuste",
                description: "Edite o resumo, experiencias e educacao para ficar do seu jeito.",
            },
            {
                title: "Aprimore com IA",
                description: "Use a IA para melhorar a clareza e o impacto do texto.",
            },
            {
                title: "Exporte e envie",
                description: "Baixe em PDF ou Markdown para enviar a vagas.",
            },
        ],
    },
    toolbar: {
        title: "Preview",
        languageCaptionPrefix: "Idioma atual:",
        translate: {
            stale: "A traducao exibida esta desatualizada. Clique em Atualizar traducao.",
            ok: "Traducao atualizada para esta versao do curriculo.",
            empty: "Nenhuma traducao gerada para este idioma ainda. Clique no botao Traduzir curriculo para gerar uma traducao.",
        },
        actions: {
            save: {
                label: "Salvar",
                hint: "Guarda no navegador",
            },
            importPdf: {
                label: "Importar PDF",
                loading: "Importando...",
                hint: "Ler curriculo pronto",
            },
            exportPdf: {
                label: "Exportar PDF",
                hint: "Baixar para enviar",
            },
            exportMarkdown: {
                label: "Exportar Markdown",
                hint: "Texto para ATS",
            },
            translate: {
                label: "Traduzir curriculo",
                loading: "Traduzindo...",
                refresh: "Atualizar traducao",
                hint: "Gerar outro idioma",
            },
            reset: {
                label: "Resetar",
                hint: "Limpar formulario",
            },
            undoReset: {
                label: "Desfazer reset",
                hint: "Recuperar ultima versao",
            },
            improve: {
                label: "Aprimorar com IA",
                loading: "Gerando...",
                hint: "Reescrever com IA",
            },
        },
        disclaimer: "Ao usar recursos de IA ou importar PDF, seus dados sao enviados ao provedor de IA para processamento.",
    },
    forms: {
        common: {
            remove: "Remover",
        },
        personal: {
            title: "Dados pessoais",
            placeholders: {
                name: "Nome",
                city: "Cidade",
                country: "Pais",
                phone: "Telefone",
                links: "Links (LinkedIn, GitHub...)",
            },
        },
        summary: {
            title: "Resumo",
            placeholder: "Resumo profissional",
        },
        experience: {
            title: "Experiencia",
            hint: "Selecione o formato por experiencia. O preview e o PDF seguem esse estilo.",
            placeholders: {
                role: "Cargo",
                company: "Empresa",
                city: "Cidade",
                period: "Periodo",
                description: "Descricao",
            },
            styleOptions: {
                bullet: "Bullet",
                paragraph: "Paragrafo",
            },
            addLabel: "+ Adicionar experiencia",
        },
        education: {
            title: "Educacao",
            placeholders: {
                school: "Instituicao",
                course: "Curso",
                city: "Cidade",
                period: "Periodo",
                description: "Descricao",
            },
            addLabel: "+ Adicionar",
        },
        extras: {
            title: "Informacoes complementares",
            placeholders: {
                skills: "Habilidades",
                certifications: "Certificacoes",
                interests: "Interesses",
            },
        },
    },
    toasts: {
        improved: "Curriculo aprimorado com sucesso.",
        improveError: "Erro ao melhorar curriculo:",
        translateSelect: "Selecione en-us ou es para traduzir.",
        translationReuse: "Reutilizando traducao ja gerada. Nenhuma nova chamada foi feita.",
        translationReady: "Traducao pronta.",
        translationError: "Erro ao traduzir curriculo:",
        saved: "Curriculo salvo localmente.",
        resetDone: "Campos resetados. Clique em Desfazer para restaurar.",
        undoReset: "Versao anterior restaurada.",
        exportMarkdownOk: "Markdown exportado com sucesso.",
        exportMarkdownError: "Erro ao exportar Markdown:",
        exportPdfStart: "Gerando PDF com texto selecionavel...",
        exportPdfOk: "PDF exportado com sucesso.",
        exportPdfError: "Erro ao exportar PDF:",
        importProcessing: "Processando PDF...",
        importExtracted: "Dados extraidos. Revise antes de aplicar.",
        importApplied: "Curriculo importado com sucesso.",
        importError: "Erro ao importar PDF:",
        importInvalid: "Arquivo invalido. Envie um PDF.",
        importTooLarge: "PDF muito grande. Limite de 5MB.",
    },
    modal: {
        title: "Revisao da importacao",
        subtitle: "Confira os dados extraidos do PDF antes de aplicar.",
        sections: {
            personal: "Dados pessoais",
            summary: "Resumo",
            experiences: "Experiencias",
            education: "Educacao",
            extras: "Extras",
        },
        fields: {
            name: "Nome",
            city: "Cidade",
            country: "Pais",
            phone: "Telefone",
            links: "Links",
            skills: "Habilidades",
            certifications: "Certificacoes",
            interests: "Interesses",
        },
        actions: {
            close: "Fechar",
            cancel: "Cancelar",
            apply: "Aplicar ao curriculo",
            merge: "Mesclar apenas campos vazios",
            replace: "Substituir tudo pelo PDF",
        },
    },
    misc: {
        emptyValue: "Nao informado",
        resetConfirm: "Deseja resetar todos os campos?",
    },
    footer: {
        label: "Desenvolvido por",
        linkText: "github.com/henrikkudesu",
        linkHref: "https://github.com/henrikkudesu",
    },
    errors: {
        invalidApiResponse: "Resposta invalida da API",
    },
};
