import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { HomeDTO } from '../src/service/dto/home.dto';
import { HomeService } from '../src/service/home.service';

describe('HomePage Controller', () => {
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
            .overrideProvider(HomeService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all homes ', async () => {
        const getEntities: HomeDTO[] = (await request(app.getHttpServer()).get('/api/homes').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET homes by id', async () => {
        const getEntity: HomeDTO = (
            await request(app.getHttpServer())
                .get('/api/homes/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create homes', async () => {
        const createdEntity: HomeDTO = (
            await request(app.getHttpServer()).post('/api/homes').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update homes', async () => {
        const updatedEntity: HomeDTO = (
            await request(app.getHttpServer()).put('/api/homes').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update homes from id', async () => {
        const updatedEntity: HomeDTO = (
            await request(app.getHttpServer())
                .put('/api/homes/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE homes', async () => {
        const deletedEntity: HomeDTO = (
            await request(app.getHttpServer())
                .delete('/api/homes/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
