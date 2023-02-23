import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ControllerDTO } from '../src/service/dto/controller.dto';
import { ControllerService } from '../src/service/controller.service';

describe('Controller Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(ControllerService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all controllers ', async () => {
        const getEntities: ControllerDTO[] = (await request(app.getHttpServer()).get('/api/controllers').expect(200))
            .body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET controllers by id', async () => {
        const getEntity: ControllerDTO = (
            await request(app.getHttpServer())
                .get('/api/controllers/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create controllers', async () => {
        const createdEntity: ControllerDTO = (
            await request(app.getHttpServer()).post('/api/controllers').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update controllers', async () => {
        const updatedEntity: ControllerDTO = (
            await request(app.getHttpServer()).put('/api/controllers').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update controllers from id', async () => {
        const updatedEntity: ControllerDTO = (
            await request(app.getHttpServer())
                .put('/api/controllers/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE controllers', async () => {
        const deletedEntity: ControllerDTO = (
            await request(app.getHttpServer())
                .delete('/api/controllers/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
