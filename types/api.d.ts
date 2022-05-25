export interface FunctionProps {
  skip: number,
  take: number,
  where: object,
  orderBy: object
}

export type Function = (args: FunctionProps) => Promise<any[]>