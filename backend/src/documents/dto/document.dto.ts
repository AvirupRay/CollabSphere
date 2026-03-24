import { IsString } from "class-validator";

export class CreateDocument{
    @IsString()
    title: string;

    @IsString()
    content: string;
}

export class UpdateDocument{
    @IsString()
    title: string;

    @IsString()
    content: string;
}