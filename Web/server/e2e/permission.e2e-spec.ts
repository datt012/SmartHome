import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PermissionDTO } from '../src/service/dto/permission.dto';
import { PermissionService } from '../src/service/permission.service';

describe('Permission Controller', () => {
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
            .overrideProvider(PermissionService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all permissions ', async () => {
        const getEntities: PermissionDTO[] = (await request(app.getHttpServer()).get('/api/permissions').expect(200))
            .body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET permissions by id', async () => {
        const getEntity: PermissionDTO = (
            await request(app.getHttpServer())
                .get('/api/permissions/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create permissions', async () => {
        const createdEntity: PermissionDTO = (
            await request(app.getHttpServer()).post('/api/permissions').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update permissions', async () => {
        const updatedEntity: PermissionDTO = (
            await request(app.getHttpServer()).put('/api/permissions').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update permissions from id', async () => {
        const updatedEntity: PermissionDTO = (
            await request(app.getHttpServer())
                .put('/api/permissions/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE permissions', async () => {
        const deletedEntity: PermissionDTO = (
            await request(app.getHttpServer())
                .delete('/api/permissions/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
