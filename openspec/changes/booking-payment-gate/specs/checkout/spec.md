## MODIFIED Requirements

### Requirement: Página de sucesso exibe ação de agendamento quando calSlug presente
A página `/checkout/sucesso` SHALL detectar o query param `calSlug` e, quando presente, renderizar um botão "Agendar agora" que abre o Cal.com em vez da mensagem genérica de acesso à plataforma.

#### Scenario: Sucesso com calSlug (produto de agendamento)
- **WHEN** o usuário chega em `/checkout/sucesso?session_id=xxx&calSlug=user%2Fevent`
- **THEN** a página exibe "Pagamento confirmado" e um botão "Agendar agora" que abre `cal.com/<calSlug>` ao ser clicado

#### Scenario: Sucesso sem calSlug (produto de plataforma/PDF)
- **WHEN** o usuário chega em `/checkout/sucesso?session_id=xxx` sem `calSlug`
- **THEN** a página exibe o comportamento atual: "Bem-vindo ao Lobby" com link para o dashboard
