// const wait = (ms) => new Promise((res) => setTimeout(res, ms));
// const mockUser = {
// id: 'u1',
// username: 'natgeo',
// fullName: 'National Geographic',
// avatar:
// 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop',
// bio: 'Exploring the world through science, exploration, and storytelling.',
// link: 'https://www.nationalgeographic.com/',
// isPrivate: false,
// isVerified: true,
// isMe: false,
// stats: { posts: 1345, followers: 28900000, following: 222 },
// highlights: [
// { id: 'h1', title: 'Wildlife', cover: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200' },
// { id: 'h2', title: 'Oceans', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200' },
// { id: 'h3', title: 'Mountains', cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200' },
// { id: 'h4', title: 'Desert', cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200' },
// ],
// relationship: { following: false, requested: false, followedBy: true },
// };


// const mockGrid = Array.from({ length: 27 }).map((_, i) => ({
// id: `p${i + 1}`,
// type: i % 7 === 0 ? 'reel' : 'photo',
// uri:
// i % 7 === 0
// ? 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=600'
// : `https://picsum.photos/seed/${i + 10}/600/600`,
// likes: Math.floor(Math.random() * 5000),
// comments: Math.floor(Math.random() * 500),
// }));


// const mockTagged = Array.from({ length: 14 }).map((_, i) => ({
// id: `t${i + 1}`,
// uri: `https://picsum.photos/seed/tag-${i + 1}/600/600`,
// }));


// export const api = {
// fetchProfile: async (username) => {
// await wait(400);
// return { ...mockUser, username };
// },
// fetchPosts: async ({ cursor }) => {
// await wait(350);
// const start = cursor ?? 0;
// const nextBatch = mockGrid.slice(start, start + 12);
// return { items: nextBatch, nextCursor: start + nextBatch.length, hasMore: start + nextBatch.length < mockGrid.length };
// },
// fetchReels: async ({ cursor }) => {
// await wait(350);
// const reels = mockGrid.filter((x) => x.type === 'reel');
// const start = cursor ?? 0;
// const batch = reels.slice(start, start + 9);
// return { items: batch, nextCursor: start + batch.length, hasMore: start + batch.length < reels.length };
// },
// fetchTagged: async ({ cursor }) => {
// await wait(350);
// const start = cursor ?? 0;
// const batch = mockTagged.slice(start, start + 12);
// return { items: batch, nextCursor: start + batch.length, hasMore: start + batch.length < mockTagged.length };
// },
// follow: async () => {
// await wait(300);
// return { following: true, requested: false };
// },
// requestFollow: async () => {
// await wait(300);
// return { following: false, requested: true };
// },
// unfollow: async () => {
// await wait(250);
// return { following: false, requested: false };
// },
// };