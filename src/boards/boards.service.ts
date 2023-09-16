import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User as MyUser, User } from 'src/auth/user.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    myUser: MyUser,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: myUser,
    });

    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(id: number, user: User): Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);
    console.log('result', result);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find board with id ${id}`);
    }
  }

  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    const board = await this.getBoardById(id, user);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }

  // THIS PART IS FOR LOCAL STORAGE OF DATA
  //   createBoard(createBoardDto: CreateBoardDto) {
  //     const { title, description } = createBoardDto;

  //     const board: Board = {
  //       id: uuid(),
  //       title,
  //       description,
  //       status: BoardStatus.PUBLIC,
  //     };

  //     this.boards.push(board);
  //     return board;

  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Can't find board with id ${id}`);
  //   }

  //   return found;
  // }

  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }

  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
