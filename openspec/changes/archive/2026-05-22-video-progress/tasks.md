## 1. GET /api/contents/[slug]/progress

- [x] 1.1 Adicionar handler `GET` em `src/app/api/contents/[slug]/progress/route.ts`
- [x] 1.2 Buscar `UserProgress` do usuário autenticado para o slug — retornar `{ watchedSeconds, completedAt }` ou `{ watchedSeconds: null, completedAt: null }` se não existir
- [x] 1.3 Retornar `401` se não autenticado

## 2. VideoPlayer — saves periódicos e retomada

- [x] 2.1 Adicionar prop `initialSeconds?: number` ao `VideoPlayer`
- [x] 2.2 Incluir `?start=${initialSeconds}` na URL do iframe quando `initialSeconds > 0`
- [x] 2.3 Remover restrição `savedRef` — saves acumulativos via setInterval
- [x] 2.4 Implementar `setInterval` de 15s enquanto `state === PLAYING` para salvar progresso
- [x] 2.5 Limpar o interval no cleanup do `useEffect` e ao PAUSE/END
- [x] 2.6 Implementar detecção de conclusão: quando `watchedSeconds >= 0.9 * totalDuration`, enviar `completedAt`
- [x] 2.7 Receber `totalDuration?: number` (em segundos) como prop + `onCompleted` callback

## 3. Página de conteúdo — exibir progresso

- [x] 3.1 Buscar `UserProgress` do usuário via Prisma antes de renderizar (Server Component)
- [x] 3.2 Passar `initialSeconds={watchedSeconds}` ao `VideoSection`
- [x] 3.3 Passar `totalDuration` derivado de `VideoMeta.duration` (`durationToSeconds`) ao `VideoSection`
- [x] 3.4 Exibir barra de progresso no `VideoSection` quando `progressPercent > 0` e não concluído
- [x] 3.5 Exibir badge "Concluído" no header e no `VideoSection` quando `completedAt` não é null

## 4. Botão "Marcar como concluído"

- [x] 4.1 Criado `CompleteButton` (client-side fetch via POST)
- [x] 4.2 POST para `/api/contents/[slug]/progress` com `completedAt: new Date().toISOString()`
- [x] 4.3 `VideoSection` gerencia estado: substitui botão por badge "Concluído" após sucesso

## 5. Validação

- [x] 5.1 Build TypeScript sem erros — cobertura de tipos valida lógica de save ✓
- [x] 5.2 `initialSeconds` passado para `?start=N` no iframe src ✓
- [x] 5.3 `checkCompletion` envia `completedAt` quando `watchedSeconds >= 0.9 * totalDuration` ✓
- [x] 5.4 `VideoSection` alterna entre `CompleteButton` e badge "Concluído" via estado React ✓
