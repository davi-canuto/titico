export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'

export interface Matchup {
  champion: string
  displayName: string
  difficulty: Difficulty
  estrategia: string[]
  dicas: string[]
  detalhes?: string[]
}
