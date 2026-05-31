## ADDED Requirements

### Requirement: Gráfico de receita temporal na aba Analytics
A aba Analytics do admin SHALL exibir um gráfico de barras de receita por período, com toggle entre visão semanal e mensal.

#### Scenario: Visão semanal — padrão
- **WHEN** o admin acessa a aba Analytics
- **THEN** um gráfico de barras exibe a receita das últimas 8 semanas, com o valor em R$ em cada barra ou no hover

#### Scenario: Toggle para visão mensal
- **WHEN** o admin clica no botão "Meses"
- **THEN** o gráfico exibe a receita dos últimos 6 meses

#### Scenario: Sem vendas no período
- **WHEN** uma semana ou mês não tem nenhuma `Purchase` completada
- **THEN** a barra correspondente tem altura zero (sem erro ou ausência de barra)

#### Scenario: Período sem dados ainda
- **WHEN** não há nenhuma `Purchase` com `status: COMPLETED`
- **THEN** o gráfico exibe barras zeradas sem erro
