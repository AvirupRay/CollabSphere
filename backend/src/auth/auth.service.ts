import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}

    async register(dto:RegisterDto){
        const existingUser=await this.prisma.user.findUnique({
            where:{email: dto.email},
        })

        if(existingUser){
            throw new BadRequestException("Email already present!");
        }

        const hashedPassword = await bcrypt.hash(dto.password,10);

        const user= await this.prisma.user.create({
            data:{
                email: dto.email,
                password: hashedPassword
            }
        });

        return{
            message: 'User registered successfully',
            userId: user.id,
        };
    }

    async login(dto:LoginDto){
        const user= await this.prisma.user.findUnique({
            where:{email: dto.email}
        })

        if(!user)   throw new UnauthorizedException('Invalid credentials!');

        const passwordMatch = await bcrypt.compare(dto.password,user.password);

        if(!passwordMatch)  throw new UnauthorizedException('Invalid credentials!');

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return{
            access_token: token,
        }

    }
    
}
