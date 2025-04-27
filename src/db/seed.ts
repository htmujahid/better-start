async function main() {
  console.log('Seeding database...')
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate async operation
  // Add your seeding logic here
  console.log('Database seeded successfully!')
}

main()
