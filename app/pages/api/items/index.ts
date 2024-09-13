import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Item, { IItem } from '../../../models/Item';  // モデルがどのデータベース/コレクションを参照するかはここで設定されます。

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    // MongoDBへの接続を確立
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Failed to connect to the database' });
  }

  switch (method) {
    case 'GET':
      try {
        // Nextdb 直下の items コレクションからデータを取得
        const items: IItem[] = await Item.find({}); 
        res.status(200).json({ success: true, data: items });
      } catch (error: any) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch items' });
      }
      break;

    case 'POST':
      try {
        // test 直下の items コレクションにアイテムを作成
        const item: IItem = await Item.create(req.body as IItem);
        res.status(201).json({ success: true, data: item });
      } catch (error: any) {
        console.error('Error creating item:', error);
        res.status(500).json({ success: false, error: 'Failed to create item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
