import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DeviceDTO } from '../src/service/dto/device.dto';
import { DeviceService } from '../src/service/device.service';

describe('Device Controller', () => {
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
            .overrideProvider(DeviceService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all devices ', async () => {
        const getEntities: DeviceDTO[] = (await request(app.getHttpServer()).get('/api/devices').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET devices by id', async () => {
        const getEntity: DeviceDTO = (
            await request(app.getHttpServer())
                .get('/api/devices/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create devices', async () => {
        const createdEntity: DeviceDTO = (
            await request(app.getHttpServer()).post('/api/devices').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update devices', async () => {
        const updatedEntity: DeviceDTO = (
            await request(app.getHttpServer()).put('/api/devices').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update devices from id', async () => {
        const updatedEntity: DeviceDTO = (
            await request(app.getHttpServer())
                .put('/api/devices/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE devices', async () => {
        const deletedEntity: DeviceDTO = (
            await request(app.getHttpServer())
                .delete('/api/devices/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
