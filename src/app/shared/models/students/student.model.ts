
export interface Student {
    id: string;
    nome: string;
    email: string;
    matricula: number;
    instituicao: string;
    curso: Array<String>;
    turma: Array<String>;
    disciplina: Array<String>;
    admin: boolean;
    dataInclusao: Date;
}
