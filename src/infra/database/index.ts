import { MarketPlaceDataSource } from "./typeorm/market-place/data-source";
import { SeederService } from "./typeorm/market-place/seeders";

export const connect = async () => {
  try {
    console.info("[DATABASE] Connecting...");

    await Promise.all([MarketPlaceDataSource.initialize()]);

    const seeder = new SeederService(MarketPlaceDataSource);
    await seeder.run();

    console.log("🌱 Seeders rodados com sucesso!");

    console.info("[DATABASE] Connected.");
  } catch (error) {
    console.error("[DATABASE] Conection error.", error);

    throw error;
  }
};
