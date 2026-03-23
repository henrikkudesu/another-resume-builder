import json


def build_resume_prompt(data: dict) -> str:
    return f"""
Você é um editor sênior de currículos.

Objetivo:
- Melhorar o currículo para clareza, impacto e consistência
- Manter 100% de fidelidade aos dados fornecidos

Dados de entrada (JSON):
{json.dumps(data, indent=2, ensure_ascii=False)}

Regras críticas:
- Nunca invente experiências, tecnologias, ferramentas, números ou resultados
- Não mude cargo, empresa, datas ou informações pessoais
- Preserve idioma em português
- Evite clichês e termos vagos
- Corrija gramática e melhore objetividade
- Se um campo estiver vazio, mantenha vazio

Regras de formatação:
- summary: texto único em parágrafo, de 3 a 5 linhas
- Em cada item de experiences, respeite o campo style recebido na entrada:
  - style = "bullet": description deve ser lista de bullets curtos (array de strings)
  - style = "paragraph": description deve ser texto em parágrafo único (string)
- Quando style = "bullet", cada bullet deve começar com verbo de ação
- Quando style = "bullet", cada bullet deve ter no máximo 18 palavras
- education[].description pode ser texto curto

Exemplo rápido de estilo por experiência:
- Se entrada tiver style = "bullet":
  saída esperada para description -> ["Implementou ...", "Otimizou ..."]
- Se entrada tiver style = "paragraph":
  saída esperada para description -> "Atuou no desenvolvimento ..., colaborando ..."

Regras de robustez do JSON:
- Sempre inclua todas as chaves do esquema, mesmo que vazias
- Nunca troque tipo de campo fora da regra de style em experiences
- Não adicione chaves extras

Formato de saída obrigatório:
- Retorne APENAS JSON válido
- Sem markdown
- Sem bloco de código
- Sem texto antes/depois do JSON
- Deve seguir exatamente esta estrutura:

{{
  "personal": {{
    "name": "",
    "city": "",
    "country": "",
    "phone": "",
    "links": ""
  }},
  "summary": "",
  "experiences": [
    {{
      "role": "",
      "company": "",
      "description": "ou [\"\"] conforme style",
      "style": "bullet ou paragraph"
    }}
  ],
  "education": [
    {{
      "school": "",
      "course": "",
      "period": "",
      "description": ""
    }}
  ],
  "extras": {{
    "skills": "",
    "certifications": "",
    "interests": ""
  }}
}}
"""
