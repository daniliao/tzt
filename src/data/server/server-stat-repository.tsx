import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { and, eq, sql } from "drizzle-orm";
import { AggregatedStatsDTO, StatDTO } from "../dto";
import { stats } from "./db-schema-stats";
import currentPricing from '@/data/ai/pricing.json'
import { InferInsertModel } from "drizzle-orm";

export function roundToTwoDigits(num: number): number {
    return Math.round(num * 100) / 100;
}

export default class ServerStatRepository extends BaseRepository<StatDTO> {

    async thisAndLastMonth(): Promise<AggregatedStatsDTO> {
        const db = (await this.db());
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        let lastMonthNo = thisMonth - 1;
        let lastMonthYearNo = thisYear;
        if (lastMonthNo < 0) { 
            lastMonthNo = 11; 
            lastMonthYearNo = thisYear - 1; 
        }

        // Use PostgreSQL's native aggregation for better performance
        const [thisMonthStats, lastMonthStats, todayStats] = await Promise.all([
            // This month stats
            db.select({
                overallTokens: sql<number>`COALESCE(SUM(${stats.promptTokens} + ${stats.completionTokens}), 0)`,
                promptTokens: sql<number>`COALESCE(SUM(${stats.promptTokens}), 0)`,
                completionTokens: sql<number>`COALESCE(SUM(${stats.completionTokens}), 0)`,
                requests: sql<number>`COALESCE(SUM(${stats.counter}), 0)`
            })
            .from(stats)
            .where(
                and(
                    eq(stats.createdMonth, thisMonth),
                    eq(stats.createdYear, thisYear)
                )
            ),

            // Last month stats
            db.select({
                overallTokens: sql<number>`COALESCE(SUM(${stats.promptTokens} + ${stats.completionTokens}), 0)`,
                promptTokens: sql<number>`COALESCE(SUM(${stats.promptTokens}), 0)`,
                completionTokens: sql<number>`COALESCE(SUM(${stats.completionTokens}), 0)`,
                requests: sql<number>`COALESCE(SUM(${stats.counter}), 0)`
            })
            .from(stats)
            .where(
                and(
                    eq(stats.createdMonth, lastMonthNo),
                    eq(stats.createdYear, lastMonthYearNo)
                )
            ),

            // Today's stats
            db.select({
                overallTokens: sql<number>`COALESCE(SUM(${stats.promptTokens} + ${stats.completionTokens}), 0)`,
                promptTokens: sql<number>`COALESCE(SUM(${stats.promptTokens}), 0)`,
                completionTokens: sql<number>`COALESCE(SUM(${stats.completionTokens}), 0)`,
                requests: sql<number>`COALESCE(SUM(${stats.counter}), 0)`
            })
            .from(stats)
            .where(
                and(
                    eq(stats.createdMonth, thisMonth),
                    eq(stats.createdYear, thisYear),
                    eq(stats.createdDay, now.getDate())
                )
            )
        ]);

        const thisMonthAggregated = {
            ...thisMonthStats[0],
            overalUSD: roundToTwoDigits(
                currentPricing["gpt-4o"].input / 1000 * thisMonthStats[0].promptTokens + 
                currentPricing["gpt-4o"].output / 1000 * thisMonthStats[0].completionTokens
            )
        };

        const lastMonthAggregated = {
            ...lastMonthStats[0],
            overalUSD: roundToTwoDigits(
                currentPricing["gpt-4o"].input / 1000 * lastMonthStats[0].promptTokens + 
                currentPricing["gpt-4o"].output / 1000 * lastMonthStats[0].completionTokens
            )
        };

        const todayAggregated = {
            ...todayStats[0],
            overalUSD: roundToTwoDigits(
                currentPricing["gpt-4o"].input / 1000 * todayStats[0].promptTokens + 
                currentPricing["gpt-4o"].output / 1000 * todayStats[0].completionTokens
            )
        };

        return {
            thisMonth: thisMonthAggregated,
            lastMonth: lastMonthAggregated,
            today: todayAggregated
        };
    }

    async aggregate(newItem: StatDTO): Promise<StatDTO> {
        const db = (await this.db());
        const date = new Date(newItem.createdAt);

        // Use a single query with UPSERT for better performance
        const insertObj = {
            completionTokens: newItem.completionTokens,
            promptTokens: newItem.promptTokens,
            createdAt: date,
            createdDay: date.getDate(),
            createdHour: date.getHours(),
            createdMonth: date.getMonth(),
            createdYear: date.getFullYear(),
            counter: 1,
            finishReasons: '',
            eventName: newItem.eventName
        };
        const result = await db.insert(stats)
            .values(insertObj as any)
            .onConflictDoUpdate({
                target: [stats.createdHour, stats.createdDay, stats.createdMonth, stats.createdYear, stats.eventName],
                set: {
                    completionTokens: sql`${stats.completionTokens} + ${newItem.completionTokens}`,
                    promptTokens: sql`${stats.promptTokens} + ${newItem.promptTokens}`,
                    counter: sql`${stats.counter} + 1`
                }
            })
            .returning();

        const stat = result[0];
        return {
            id: stat.id,
            eventName: stat.eventName || '',
            promptTokens: stat.promptTokens ?? 0,
            completionTokens: stat.completionTokens ?? 0,
            createdAt: stat.createdAt instanceof Date ? stat.createdAt.toISOString() : stat.createdAt,
            finishReasons: stat.finishReasons ?? undefined,
            createdMonth: stat.createdMonth ?? undefined,
            createdDay: stat.createdDay ?? undefined,
            createdYear: stat.createdYear ?? undefined,
            createdHour: stat.createdHour ?? undefined,
            counter: stat.counter ?? undefined
        };
    }
}