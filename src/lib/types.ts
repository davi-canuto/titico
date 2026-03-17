export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'

export interface Matchup {
  champion: string        // nome para o Data Dragon CDN (ex: "Viego")
  displayName: string     // nome de exibição
  difficulty: Difficulty
  estrategia: string[]
  dicas: string[]
  detalhes?: string[]
  itemSugestao?: {
    name: string
    id: number            // ID do item no Data Dragon
  }
}
